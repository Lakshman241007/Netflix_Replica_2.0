import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../server/src/app.js';
import { seedDatabase } from '../server/src/seed/seedDatabase.js';

let server;
let baseUrl;

test.before(async () => {
  await seedDatabase();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

// --- Phase 1 & 2 Tests ---

test('GET /api/health returns health status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.message, 'Netflix Replica API is running');
});

test('GET /api/movies returns movies array', async () => {
  const res = await fetch(`${baseUrl}/api/movies`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length >= 15);
});

test('GET /api/movies?page=1&limit=5 supports pagination', async () => {
  const res = await fetch(`${baseUrl}/api/movies?page=1&limit=5`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.length, 5);
});

test('GET /api/movies/featured returns featured content', async () => {
  const res = await fetch(`${baseUrl}/api/movies/featured`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length > 0);
});

test('GET /api/movies/popular returns popular content sorted by popularity', async () => {
  const res = await fetch(`${baseUrl}/api/movies/popular`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data[0].popularity >= data.data[data.data.length - 1].popularity);
});

test('GET /api/movies/trending returns trending content', async () => {
  const res = await fetch(`${baseUrl}/api/movies/trending`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length > 0);
});

test('GET /api/movies/genre/:genre returns filtered movies', async () => {
  const res = await fetch(`${baseUrl}/api/movies/genre/action`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.every(m => m.genres.some(g => g.toLowerCase().includes('action'))));
});

test('GET /api/movies/:id returns single movie with correct schema', async () => {
  const allRes = await fetch(`${baseUrl}/api/movies`);
  const allData = await allRes.json();
  const firstId = allData.data[0]._id || allData.data[0].id;

  const res = await fetch(`${baseUrl}/api/movies/${firstId}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.title, allData.data[0].title);
  assert.ok(data.data.description);
  assert.ok(data.data.rating);
  assert.ok(data.data.duration);
});

test('GET /api/movies/:id with invalid id returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/movies/non-existent-id-9999`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.message, 'Movie not found');
});

test('GET /api/genres returns genres list', async () => {
  const res = await fetch(`${baseUrl}/api/genres`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length >= 8);
});

test('GET /api/genres/:id returns single genre', async () => {
  const allRes = await fetch(`${baseUrl}/api/genres`);
  const allData = await allRes.json();
  const firstId = allData.data[0]._id || allData.data[0].id;

  const res = await fetch(`${baseUrl}/api/genres/${firstId}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.name, allData.data[0].name);
});

test('GET /api/genres/:id with invalid id returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/genres/non-existent-genre-slug-9999`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.message, 'Genre not found');
});

// --- Phase 3 Authentication Tests ---

let userAToken = '';
const userAEmail = `user_a_${Date.now()}@example.com`;

let userBToken = '';
const userBEmail = `user_b_${Date.now()}@example.com`;

test('POST /api/auth/register registers User A and creates default profile', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'User Alpha',
      email: userAEmail,
      password: 'password123'
    })
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.token);
  userAToken = json.data.token;

  // Verify default profile was created
  const profRes = await fetch(`${baseUrl}/api/profiles`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(profRes.status, 200);
  const profJson = await profRes.json();
  assert.equal(profJson.success, true);
  assert.ok(profJson.data.length >= 1);
  assert.equal(profJson.data[0].name, 'User Alpha');
});

test('POST /api/auth/register registers User B', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'User Beta',
      email: userBEmail,
      password: 'password123'
    })
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  userBToken = json.data.token;
});

test('POST /api/auth/register fails with duplicate email (409)', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate Alpha',
      email: userAEmail,
      password: 'password123'
    })
  });

  assert.equal(res.status, 409);
});

test('POST /api/auth/login succeeds with valid credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userAEmail,
      password: 'password123'
    })
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.token);
});

test('GET /api/auth/me returns current user with valid Bearer token (200)', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${userAToken}`
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.name, 'User Alpha');
});

// --- Phase 4 Profile Tests ---

let userAProfile1Id = '';
let userAProfile2Id = '';
let userBProfile1Id = '';

test('GET /api/profiles returns only authenticated user profiles', async () => {
  const resA = await fetch(`${baseUrl}/api/profiles`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(resA.status, 200);
  const dataA = await resA.json();
  assert.ok(dataA.data.every(p => p.name !== 'User Beta'));
  userAProfile1Id = dataA.data[0]._id || dataA.data[0].id;

  const resB = await fetch(`${baseUrl}/api/profiles`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });
  assert.equal(resB.status, 200);
  const dataB = await resB.json();
  assert.ok(dataB.data.every(p => p.name !== 'User Alpha'));
  userBProfile1Id = dataB.data[0]._id || dataB.data[0].id;
});

test('POST /api/profiles creates profile under authenticated user', async () => {
  const res = await fetch(`${baseUrl}/api/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({
      name: 'Kids Zone',
      isKids: true
    })
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.name, 'Kids Zone');
  assert.equal(json.data.isKids, true);
  assert.ok(json.data.avatar);

  userAProfile2Id = json.data.id || json.data._id;
});

test('GET /api/profiles/:id allows owner to retrieve profile', async () => {
  const res = await fetch(`${baseUrl}/api/profiles/${userAProfile2Id}`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.name, 'Kids Zone');
});

test('GET /api/profiles/:id denies cross-user access (404)', async () => {
  const res = await fetch(`${baseUrl}/api/profiles/${userAProfile2Id}`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });

  assert.equal(res.status, 404);
  const json = await res.json();
  assert.equal(json.success, false);
});

test('PUT /api/profiles/:id allows owner to update profile', async () => {
  const res = await fetch(`${baseUrl}/api/profiles/${userAProfile2Id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({
      name: 'Family Corner',
      isKids: false
    })
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.name, 'Family Corner');
  assert.equal(json.data.isKids, false);
});

test('PUT /api/profiles/:id denies cross-user update (404)', async () => {
  const res = await fetch(`${baseUrl}/api/profiles/${userAProfile2Id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userBToken}`
    },
    body: JSON.stringify({
      name: 'Hacked Name'
    })
  });

  assert.equal(res.status, 404);
});

test('DELETE /api/profiles/:id rejects deleting last remaining profile (400)', async () => {
  const deleteRes = await fetch(`${baseUrl}/api/profiles/${userBProfile1Id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userBToken}` }
  });

  assert.equal(deleteRes.status, 400);
  const json = await deleteRes.json();
  assert.equal(json.success, false);
  assert.ok(json.message.includes('At least one profile is required'));
});

test('POST /api/profiles enforces 5 profile limit per account', async () => {
  for (let i = 3; i <= 5; i++) {
    const res = await fetch(`${baseUrl}/api/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({ name: `Profile ${i}` })
    });
    assert.equal(res.status, 201);
  }

  const failRes = await fetch(`${baseUrl}/api/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ name: 'Profile 6' })
  });

  assert.equal(failRes.status, 400);
  const failJson = await failRes.json();
  assert.ok(failJson.message.includes('Maximum of 5 profiles allowed'));
});

// --- Phase 5 Search Tests ---

test('GET /api/search?q=neon returns matched content', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=neon`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.ok(json.data.some(m => m.title.toLowerCase().includes('neon')));
  assert.ok(json.pagination);
  assert.equal(json.pagination.page, 1);
});

test('GET /api/search is case-insensitive (NEON, Neon, neon)', async () => {
  const resUpper = await fetch(`${baseUrl}/api/search?q=NEON`);
  const resMixed = await fetch(`${baseUrl}/api/search?q=NeOn`);
  const resLower = await fetch(`${baseUrl}/api/search?q=neon`);

  assert.equal(resUpper.status, 200);
  assert.equal(resMixed.status, 200);
  assert.equal(resLower.status, 200);

  const jsonUpper = await resUpper.json();
  const jsonMixed = await resMixed.json();
  const jsonLower = await resLower.json();

  assert.equal(jsonUpper.pagination.total, jsonLower.pagination.total);
  assert.equal(jsonMixed.pagination.total, jsonLower.pagination.total);
});

test('GET /api/search supports partial matching (odys -> Neon Odyssey)', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=odys`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.some(m => m.title.toLowerCase().includes('odyssey')));
});

test('GET /api/search returns empty array for nonexistent queries', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=nonexistentquery_xyz_999`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.length, 0);
  assert.equal(json.pagination.total, 0);
});

test('GET /api/search rejects missing query parameter (400)', async () => {
  const res = await fetch(`${baseUrl}/api/search`);
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.message, 'Search query is required');
});

test('GET /api/search?q=a&page=1&limit=3 supports pagination', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=a&page=1&limit=3`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length <= 3);
  assert.equal(json.pagination.limit, 3);
  assert.equal(json.pagination.page, 1);
});

test('GET /api/search?q=action&genre=action filters by genre', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=action&genre=action`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.every(m => m.genres.some(g => g.toLowerCase().includes('action'))));
});

// --- Phase 6 Watchlist Tests ---

let movie1Id = '';
let movie2Id = '';
let movie3Id = '';

test('GET /api/movies retrieves movie IDs for watchlist tests', async () => {
  const res = await fetch(`${baseUrl}/api/movies`);
  const json = await res.json();
  assert.ok(json.data.length >= 3);
  movie1Id = json.data[0]._id || json.data[0].id;
  movie2Id = json.data[1]._id || json.data[1].id;
  movie3Id = json.data[2]._id || json.data[2].id;
});

test('Watchlist rejects unauthenticated requests (401)', async () => {
  const getRes = await fetch(`${baseUrl}/api/watchlist?profileId=${userAProfile1Id}`);
  assert.equal(getRes.status, 401);

  const postRes = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId: userAProfile1Id, movieId: movie1Id })
  });
  assert.equal(postRes.status, 401);

  const deleteRes = await fetch(`${baseUrl}/api/watchlist/${movie1Id}?profileId=${userAProfile1Id}`, {
    method: 'DELETE'
  });
  assert.equal(deleteRes.status, 401);
});

test('Watchlist rejects requests missing active profile (400)', async () => {
  const res = await fetch(`${baseUrl}/api/watchlist`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.ok(json.message.includes('Profile ID is required'));
});

test('Watchlist rejects cross-user profile access (403/400)', async () => {
  // User B attempts to access User A's profile watchlist
  const res = await fetch(`${baseUrl}/api/watchlist?profileId=${userAProfile1Id}`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });
  assert.equal(res.status >= 400, true);
});

test('POST /api/watchlist adds movie to active profile', async () => {
  const res = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ movieId: movie1Id })
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.movieId, movie1Id);
});

test('POST /api/watchlist rejects duplicate movie additions (400)', async () => {
  const res = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ movieId: movie1Id })
  });

  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
  assert.ok(json.message.includes('already exists in My List'));
});

test('GET /api/watchlist/check/:movieId returns status', async () => {
  // Saved movie
  const resSaved = await fetch(`${baseUrl}/api/watchlist/check/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(resSaved.status, 200);
  const jsonSaved = await resSaved.json();
  assert.equal(jsonSaved.data.inWatchlist, true);

  // Unsaved movie
  const resUnsaved = await fetch(`${baseUrl}/api/watchlist/check/${movie2Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(resUnsaved.status, 200);
  const jsonUnsaved = await resUnsaved.json();
  assert.equal(jsonUnsaved.data.inWatchlist, false);
});

test('DELETE /api/watchlist/:movieId removes movie from watchlist', async () => {
  const res = await fetch(`${baseUrl}/api/watchlist/${movie1Id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);

  // Check again to verify removal
  const checkRes = await fetch(`${baseUrl}/api/watchlist/check/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const checkJson = await checkRes.json();
  assert.equal(checkJson.data.inWatchlist, false);
});

test('DELETE /api/watchlist/:movieId returns 404 for item not in list', async () => {
  const res = await fetch(`${baseUrl}/api/watchlist/nonexistent_movie_id`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 404);
});

// --- MANDATORY STEP 31: PROFILE ISOLATION TEST ---
test('MANDATORY: Profile Isolation Test (Profile A1, Profile A2, Profile B1)', async () => {
  // Add Movie 1 -> Profile A1
  const addA1 = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ movieId: movie1Id })
  });
  assert.equal(addA1.status, 201);

  // Add Movie 2 -> Profile A2
  const addA2 = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile2Id
    },
    body: JSON.stringify({ movieId: movie2Id })
  });
  assert.equal(addA2.status, 201);

  // Add Movie 3 -> Profile B1
  const addB1 = await fetch(`${baseUrl}/api/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userBProfile1Id
    },
    body: JSON.stringify({ movieId: movie3Id })
  });
  assert.equal(addB1.status, 201);

  // Verify Profile A1 sees Movie 1 ONLY
  const listA1 = await fetch(`${baseUrl}/api/watchlist`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const jsonA1 = await listA1.json();
  const idsA1 = jsonA1.data.map(m => m._id || m.id);
  assert.ok(idsA1.includes(movie1Id), 'Profile A1 must contain Movie 1');
  assert.ok(!idsA1.includes(movie2Id), 'Profile A1 must NOT contain Movie 2');
  assert.ok(!idsA1.includes(movie3Id), 'Profile A1 must NOT contain Movie 3');

  // Verify Profile A2 sees Movie 2 ONLY
  const listA2 = await fetch(`${baseUrl}/api/watchlist`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile2Id
    }
  });
  const jsonA2 = await listA2.json();
  const idsA2 = jsonA2.data.map(m => m._id || m.id);
  assert.ok(!idsA2.includes(movie1Id), 'Profile A2 must NOT contain Movie 1');
  assert.ok(idsA2.includes(movie2Id), 'Profile A2 must contain Movie 2');
  assert.ok(!idsA2.includes(movie3Id), 'Profile A2 must NOT contain Movie 3');

  // Verify Profile B1 sees Movie 3 ONLY
  const listB1 = await fetch(`${baseUrl}/api/watchlist`, {
    headers: {
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userBProfile1Id
    }
  });
  const jsonB1 = await listB1.json();
  const idsB1 = jsonB1.data.map(m => m._id || m.id);
  assert.ok(!idsB1.includes(movie1Id), 'Profile B1 must NOT contain Movie 1');
  assert.ok(!idsB1.includes(movie2Id), 'Profile B1 must NOT contain Movie 2');
  assert.ok(idsB1.includes(movie3Id), 'Profile B1 must contain Movie 3');
});

// --- Phase 7 Playback Tests ---

test('Playback rejects unauthenticated requests (401)', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}?profileId=${userAProfile1Id}`);
  assert.equal(res.status, 401);

  const saveRes = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ position: 100, duration: 600, profileId: userAProfile1Id })
  });
  assert.equal(saveRes.status, 401);
});

test('Playback rejects requests missing active profile (400)', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.ok(json.message.includes('Profile ID is required'));
});

test('Playback rejects cross-user profile access (403)', async () => {
  // User B tries to access User A's profile playback
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 403);
});

test('Playback rejects non-existent movies (404)', async () => {
  const res = await fetch(`${baseUrl}/api/playback/nonexistent_movie_id_999`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 404);
});

test('GET /api/playback/:movieId returns initial default state for unplayed title', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.position, 0);
  assert.equal(json.data.completed, false);
});

test('POST /api/playback/:movieId records playback progress', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({
      position: 120,
      duration: 600,
      isPlaying: true
    })
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.position, 120);
  assert.equal(json.data.duration, 600);
  assert.equal(json.data.progress, 20);
  assert.equal(json.data.completed, false);
});

test('GET /api/playback/:movieId retrieves saved playback state', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.position, 120);
  assert.equal(json.data.duration, 600);
  assert.equal(json.data.progress, 20);
});

test('POST /api/playback/:movieId/complete marks playback as completed', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}/complete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.completed, true);
  assert.equal(json.data.progress, 100);
});

test('MANDATORY: Playback Profile Isolation Test (Profile A1, Profile A2, Profile B1)', async () => {
  // Profile A1 watches Movie 2 at position 200
  await fetch(`${baseUrl}/api/playback/${movie2Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ position: 200, duration: 1000 })
  });

  // Profile A2 watches Movie 2 at position 500
  await fetch(`${baseUrl}/api/playback/${movie2Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile2Id
    },
    body: JSON.stringify({ position: 500, duration: 1000 })
  });

  // Profile B1 watches Movie 2 at position 800
  await fetch(`${baseUrl}/api/playback/${movie2Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userBProfile1Id
    },
    body: JSON.stringify({ position: 800, duration: 1000 })
  });

  // Verify Profile A1 state
  const resA1 = await fetch(`${baseUrl}/api/playback/${movie2Id}`, {
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile1Id }
  });
  const jsonA1 = await resA1.json();
  assert.equal(jsonA1.data.position, 200, 'Profile A1 must have position 200');

  // Verify Profile A2 state
  const resA2 = await fetch(`${baseUrl}/api/playback/${movie2Id}`, {
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile2Id }
  });
  const jsonA2 = await resA2.json();
  assert.equal(jsonA2.data.position, 500, 'Profile A2 must have position 500');

  // Verify Profile B1 state
  const resB1 = await fetch(`${baseUrl}/api/playback/${movie2Id}`, {
    headers: { Authorization: `Bearer ${userBToken}`, 'x-profile-id': userBProfile1Id }
  });
  const jsonB1 = await resB1.json();
  assert.equal(jsonB1.data.position, 800, 'Profile B1 must have position 800');
});

test('DELETE /api/playback/:movieId resets playback state', async () => {
  const res = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);

  // Check state after deletion - should return fresh default state
  const checkRes = await fetch(`${baseUrl}/api/playback/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const checkJson = await checkRes.json();
  assert.equal(checkJson.data.position, 0);
  assert.equal(checkJson.data.completed, false);
});

// --- Phase 8 Watch History & Continue Watching Tests ---

test('Watch History rejects unauthenticated requests (401)', async () => {
  const getRes = await fetch(`${baseUrl}/api/history?profileId=${userAProfile1Id}`);
  assert.equal(getRes.status, 401);

  const postRes = await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ position: 200, duration: 1000, profileId: userAProfile1Id })
  });
  assert.equal(postRes.status, 401);

  const cwRes = await fetch(`${baseUrl}/api/history/continue-watching?profileId=${userAProfile1Id}`);
  assert.equal(cwRes.status, 401);
});

test('Watch History rejects requests missing active profile (400)', async () => {
  const res = await fetch(`${baseUrl}/api/history`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.ok(json.message.includes('Profile ID is required'));
});

test('Watch History rejects cross-user profile access (403)', async () => {
  // User B tries to view User A's profile history
  const res = await fetch(`${baseUrl}/api/history`, {
    headers: {
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 403);
});

test('Watch History rejects non-existent movies (404)', async () => {
  const res = await fetch(`${baseUrl}/api/history/nonexistent_movie_id_999`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 404);
});

test('POST /api/history/:movieId creates/updates watch history record', async () => {
  const res = await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({
      position: 300,
      duration: 1000
    })
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.position, 300);
  assert.equal(json.data.duration, 1000);
  assert.equal(json.data.progress, 30);
  assert.equal(json.data.completed, false);
});

test('GET /api/history/:movieId retrieves specific movie history record', async () => {
  const res = await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.position, 300);
  assert.equal(json.data.movieId, movie1Id);
  assert.ok(json.data.movie);
  assert.equal(json.data.movie.title !== undefined, true);
});

test('GET /api/history returns populated watch history list with pagination', async () => {
  // Add another movie to history
  await fetch(`${baseUrl}/api/history/${movie2Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ position: 500, duration: 1000 })
  });

  const res = await fetch(`${baseUrl}/api/history?page=1&limit=10`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 2);
  assert.ok(json.pagination);
  assert.equal(json.pagination.page, 1);
  // Order: newest activity first (movie2 was updated after movie1)
  assert.equal(json.data[0].movieId, movie2Id);
});

test('GET /api/history/continue-watching returns in-progress titles and excludes completed', async () => {
  // Mark movie3 as 100% completed
  await fetch(`${baseUrl}/api/history/${movie3Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ position: 1000, duration: 1000, completed: true })
  });

  const res = await fetch(`${baseUrl}/api/history/continue-watching`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));

  const continueMovieIds = json.data.map(m => m.movieId || m.id || m._id);
  // movie1 (30%) and movie2 (50%) must be present in continue watching
  assert.ok(continueMovieIds.includes(movie1Id), 'In-progress Movie 1 must be in Continue Watching');
  assert.ok(continueMovieIds.includes(movie2Id), 'In-progress Movie 2 must be in Continue Watching');
  // movie3 (100% completed) must NOT be in continue watching
  assert.ok(!continueMovieIds.includes(movie3Id), 'Completed Movie 3 must NOT be in Continue Watching');
});

test('DELETE /api/history/:movieId removes single movie from watch history', async () => {
  const deleteRes = await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });

  assert.equal(deleteRes.status, 200);

  // Check single movie query returns 404
  const checkRes = await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(checkRes.status, 404);
});

test('MANDATORY: Watch History & Continue Watching Profile Isolation Test (Profile A1, Profile A2, Profile B1)', async () => {
  // Clear any existing history for test profiles
  await fetch(`${baseUrl}/api/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile1Id }
  });
  await fetch(`${baseUrl}/api/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile2Id }
  });
  await fetch(`${baseUrl}/api/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userBToken}`, 'x-profile-id': userBProfile1Id }
  });

  // Profile A1 watches Movie 1 at 70%
  await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ position: 700, duration: 1000 })
  });

  // Profile A2 watches Movie 2 at 20%
  await fetch(`${baseUrl}/api/history/${movie2Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile2Id
    },
    body: JSON.stringify({ position: 200, duration: 1000 })
  });

  // Profile B1 watches Movie 3 at 40%
  await fetch(`${baseUrl}/api/history/${movie3Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userBProfile1Id
    },
    body: JSON.stringify({ position: 400, duration: 1000 })
  });

  // Verify Profile A1 Continue Watching has Movie 1 ONLY
  const cwA1 = await fetch(`${baseUrl}/api/history/continue-watching`, {
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile1Id }
  });
  const jsonCwA1 = await cwA1.json();
  const idsA1 = jsonCwA1.data.map(m => m.movieId || m.id || m._id);
  assert.ok(idsA1.includes(movie1Id), 'Profile A1 must contain Movie 1');
  assert.ok(!idsA1.includes(movie2Id), 'Profile A1 must NOT contain Movie 2');
  assert.ok(!idsA1.includes(movie3Id), 'Profile A1 must NOT contain Movie 3');

  // Verify Profile A2 Continue Watching has Movie 2 ONLY
  const cwA2 = await fetch(`${baseUrl}/api/history/continue-watching`, {
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile2Id }
  });
  const jsonCwA2 = await cwA2.json();
  const idsA2 = jsonCwA2.data.map(m => m.movieId || m.id || m._id);
  assert.ok(!idsA2.includes(movie1Id), 'Profile A2 must NOT contain Movie 1');
  assert.ok(idsA2.includes(movie2Id), 'Profile A2 must contain Movie 2');
  assert.ok(!idsA2.includes(movie3Id), 'Profile A2 must NOT contain Movie 3');

  // Verify Profile B1 Continue Watching has Movie 3 ONLY
  const cwB1 = await fetch(`${baseUrl}/api/history/continue-watching`, {
    headers: { Authorization: `Bearer ${userBToken}`, 'x-profile-id': userBProfile1Id }
  });
  const jsonCwB1 = await cwB1.json();
  const idsB1 = jsonCwB1.data.map(m => m.movieId || m.id || m._id);
  assert.ok(!idsB1.includes(movie1Id), 'Profile B1 must NOT contain Movie 1');
  assert.ok(!idsB1.includes(movie2Id), 'Profile B1 must NOT contain Movie 2');
  assert.ok(idsB1.includes(movie3Id), 'Profile B1 must contain Movie 3');
});

test('DELETE /api/history clears profile watch history', async () => {
  const clearRes = await fetch(`${baseUrl}/api/history`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(clearRes.status, 200);

  const getRes = await fetch(`${baseUrl}/api/history`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const json = await getRes.json();
  assert.equal(json.data.length, 0);
});

// --- Phase 10: Recommendations & Notifications Tests ---

test('GET /api/recommendations rejects unauthenticated request with 401', async () => {
  const res = await fetch(`${baseUrl}/api/recommendations`);
  assert.equal(res.status, 401);
});

test('GET /api/recommendations without active profile returns 400', async () => {
  const res = await fetch(`${baseUrl}/api/recommendations`, {
    headers: {
      Authorization: `Bearer ${userAToken}`
    }
  });
  assert.equal(res.status, 400);
});

test('GET /api/recommendations rejects unauthorized profile with 403', async () => {
  const res = await fetch(`${baseUrl}/api/recommendations`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userBProfile1Id
    }
  });
  assert.equal(res.status, 403);
});

test('GET /api/recommendations returns explainable recommendations with fallback', async () => {
  const res = await fetch(`${baseUrl}/api/recommendations`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.ok(json.data[0].title || json.data[0].movie?.title);
  assert.ok(json.data[0].reason);
});

test('MANDATORY: Profile-Specific Recommendations Isolation Test', async () => {
  // Clear Profile A1 and Profile B1 history
  await fetch(`${baseUrl}/api/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userAToken}`, 'x-profile-id': userAProfile1Id }
  });
  await fetch(`${baseUrl}/api/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userBToken}`, 'x-profile-id': userBProfile1Id }
  });

  // Profile A1 watches Movie 1 (Action / Sci-Fi)
  await fetch(`${baseUrl}/api/history/${movie1Id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    },
    body: JSON.stringify({ position: 500, duration: 1000 })
  });

  // Fetch recommendations for Profile A1
  const recA1 = await fetch(`${baseUrl}/api/recommendations`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const jsonA1 = await recA1.json();
  assert.equal(jsonA1.success, true);
  assert.ok(jsonA1.data.length > 0);
  // Profile A1 recommendation reason should reflect watch history
  const hasHistoryReason = jsonA1.data.some(r => r.reason.includes('Because you watched') || r.reason.includes('Action') || r.reason.includes('Sci-Fi'));
  assert.ok(hasHistoryReason, 'Profile A1 recommendations should include watch-history based reason');

  // Profile B1 has no history and receives trending / popular fallback
  const recB1 = await fetch(`${baseUrl}/api/recommendations`, {
    headers: {
      Authorization: `Bearer ${userBToken}`,
      'x-profile-id': userBProfile1Id
    }
  });
  const jsonB1 = await recB1.json();
  assert.equal(jsonB1.success, true);
  assert.ok(jsonB1.data.length > 0);
  assert.ok(jsonB1.data[0].reason);
});

test('GET /api/notifications returns user/broadcast notifications', async () => {
  const res = await fetch(`${baseUrl}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.ok(typeof json.unreadCount === 'number');
});

test('PATCH /api/notifications/:id/read and mark-all read updates notification read status', async () => {
  const getRes = await fetch(`${baseUrl}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const initial = await getRes.json();
  const firstId = initial.data[0].id || initial.data[0]._id;

  // Mark single as read
  const markRes = await fetch(`${baseUrl}/api/notifications/${firstId}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(markRes.status, 200);

  // Mark all as read
  const markAllRes = await fetch(`${baseUrl}/api/notifications/read-all`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  assert.equal(markAllRes.status, 200);

  const finalRes = await fetch(`${baseUrl}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${userAToken}`,
      'x-profile-id': userAProfile1Id
    }
  });
  const finalJson = await finalRes.json();
  assert.equal(finalJson.unreadCount, 0);
});

// --- Phase 11 Tests: Subscription Simulation & Plans ---

test('GET /api/subscription rejects unauthenticated requests with 401', async () => {
  const res = await fetch(`${baseUrl}/api/subscription`);
  assert.equal(res.status, 401);
});

test('GET /api/subscription/plans returns available plan tiers', async () => {
  const res = await fetch(`${baseUrl}/api/subscription/plans`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.equal(json.data.length, 3);
  const planNames = json.data.map((p) => p.name);
  assert.ok(planNames.includes('Basic'));
  assert.ok(planNames.includes('Standard'));
  assert.ok(planNames.includes('Premium'));
});

test('GET /api/subscription returns authenticated user subscription details', async () => {
  const res = await fetch(`${baseUrl}/api/subscription`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data);
  assert.ok(['active', 'inactive', 'cancelled'].includes(json.data.status));
});

test('POST /api/subscription rejects invalid plan with 400', async () => {
  const res = await fetch(`${baseUrl}/api/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ plan: 'SuperUltraNotValid' })
  });
  assert.equal(res.status, 400);
});

test('POST /api/subscription creates or updates plan to Premium', async () => {
  const res = await fetch(`${baseUrl}/api/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ plan: 'Premium' })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.plan, 'Premium');
  assert.equal(json.data.status, 'active');
  assert.equal(json.data.price, 17.99);
});

test('PUT /api/subscription updates plan to Basic', async () => {
  const res = await fetch(`${baseUrl}/api/subscription`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ plan: 'Basic' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.plan, 'Basic');
  assert.equal(json.data.price, 8.99);
  assert.equal(json.data.status, 'active');
});

test('DELETE /api/subscription cancels user membership', async () => {
  const res = await fetch(`${baseUrl}/api/subscription`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'cancelled');

  // Verify status in GET
  const checkRes = await fetch(`${baseUrl}/api/subscription`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  const checkJson = await checkRes.json();
  assert.equal(checkJson.data.status, 'cancelled');
});

test('POST /api/subscription/reactivate reactivates cancelled subscription', async () => {
  const res = await fetch(`${baseUrl}/api/subscription/reactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'active');
});

test('MANDATORY: User Subscription Isolation Test', async () => {
  // Set User A to Basic
  await fetch(`${baseUrl}/api/subscription`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ plan: 'Basic' })
  });

  // Set User B to Premium
  await fetch(`${baseUrl}/api/subscription`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userBToken}`
    },
    body: JSON.stringify({ plan: 'Premium' })
  });

  // Fetch User A sub
  const resA = await fetch(`${baseUrl}/api/subscription`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  const jsonA = await resA.json();
  assert.equal(jsonA.data.plan, 'Basic');

  // Fetch User B sub
  const resB = await fetch(`${baseUrl}/api/subscription`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });
  const jsonB = await resB.json();
  assert.equal(jsonB.data.plan, 'Premium');

  // Cancelling User A should not cancel User B
  await fetch(`${baseUrl}/api/subscription`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userAToken}` }
  });

  const checkB = await fetch(`${baseUrl}/api/subscription`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });
  const jsonCheckB = await checkB.json();
  assert.equal(jsonCheckB.data.status, 'active');
  assert.equal(jsonCheckB.data.plan, 'Premium');
});


