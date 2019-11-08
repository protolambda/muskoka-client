# Muskoka-client

Browse ETH 2.0 state transitions, the results of different clients running them, and start new transitions.

## Usage

`yarn build` to build the new files to deploy.

`yarn start` for a local development server with hot reloading.

## Firebase

Firebase hosting is used to have Muskoka functionality presented on one domain, and redeploy cloud functions and frontend easily. 

Install firebase CLI tool: `npm install -g firebase-tools`

Login: `firebase login`

### Hosting

Hosting configuration can be found in `firebase.json`, from this dir, deploy the frontend (and apply hosting configuration to forward paths to cloud funcs) with:
`firebase deploy --project muskoka --only hosting`

The cloud functions of Muskoka are written in Go and deployed separately (hence the `--only hosting`).

### Firestore

Firestore (the revived google-datastore product) is used to back the tasks/results tracking.
Queries require composite indexes because of the applied sort order. See `firestore.indexes.json`.
Luckily, zig-zag merge-joins allow to not have indexes for any permutation, we just need `(index, *field*)` pairs. 

The indexes can be deployed with `firebase deploy --project muskoka --only firestore:indexes`

## License

MIT, see [LICENSE](./LICENSE) file.
