import React from 'react';

export const FirebaseContext = React.createContext(
// default values used by a Consumer when it does not have a
// matching Provider above it in the tree, useful for testing
  {
    firebase: {
       currentUser: null,
       firebaseLoaded: false,
       firestoreConnection: null,
       localStore: null,
    }
  }
);
