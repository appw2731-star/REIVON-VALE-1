import test from 'node:test';
import assert from 'node:assert/strict';
import { isAuthorizedOwnerAccount, OWNER_ADMIN_EMAIL } from './adminAuth.ts';

test('isAuthorizedOwnerAccount authorizes only verified webrokib@gmail.com', () => {
  assert.equal(OWNER_ADMIN_EMAIL, 'webrokib@gmail.com');
  assert.equal(
    isAuthorizedOwnerAccount({ email: 'webrokib@gmail.com', emailVerified: true }),
    true
  );
  assert.equal(
    isAuthorizedOwnerAccount({ email: '  WebRokib@Gmail.COM ', emailVerified: true }),
    true
  );
});

test('isAuthorizedOwnerAccount rejects unverified owner email and all other accounts', () => {
  assert.equal(
    isAuthorizedOwnerAccount({ email: 'webrokib@gmail.com', emailVerified: false }),
    false
  );
  assert.equal(
    isAuthorizedOwnerAccount({ email: 'webrokib@gmail.com', emailVerified: null }),
    false
  );
  assert.equal(
    isAuthorizedOwnerAccount({ email: 'otheruser@gmail.com', emailVerified: true }),
    false
  );
  assert.equal(
    isAuthorizedOwnerAccount({ email: 'webrokib+test@gmail.com', emailVerified: true }),
    false
  );
  assert.equal(
    isAuthorizedOwnerAccount({ email: 'webrokib@yahoo.com', emailVerified: true }),
    false
  );
  assert.equal(isAuthorizedOwnerAccount({ email: '', emailVerified: true }), false);
  assert.equal(isAuthorizedOwnerAccount(null), false);
  assert.equal(isAuthorizedOwnerAccount(undefined), false);
});
