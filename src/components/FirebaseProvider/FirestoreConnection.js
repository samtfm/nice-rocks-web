class FirestoreConnection{
  constructor(db, localStore){
    this.db = db;
    this.localStore = localStore;
  }

  //
  //  example: getRocks("toUser", "==", user.uid)
  getRocks = (field, comparitor, value) => {
    const rocksRef = this.db.collection("rocks");
    const usersRef = this.db.collection("users");
    return new Promise((resolve, reject) => {
      try {
        rocksRef.where(field, comparitor, value).get().then((querySnapshot) => {
          const rocks = querySnapshot.docs.map((doc) => {
            const rock = doc.data()
            rock.id = doc.id;
            return rock;
          });

          const userSet = new Set();
          rocks.forEach(rock => {
            userSet.add(rock.fromUser)
            userSet.add(rock.toUser)
          })

          this.ensureUsers(userSet).then(() => {
            rocks.forEach(rock => {
              rock['fromUser'] = this.localStore.users[rock.fromUser]
              rock['toUser'] = this.localStore.users[rock.toUser]
            })
            resolve(rocks);
          })
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  ensureUsers = (userSet) => {
    return new Promise((resolve, reject) => {
      const missingUserRequests = [...userSet].filter(id => {
        return !this.localStore.users[id]
      }).map(id => {
        return this.db.collection('users').doc(id).get();
      });

      Promise.all(missingUserRequests).then(docs => {
        docs.map(doc => {
          const user = doc.data();
          this.localStore.users[doc.id] = user;
        })
        resolve();
      });
    })
  }

  postRock = (data) => {
    this.db.collection("rocks").add(
      {
        note: data.note,
        url: data.url,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }
    )
  }
}

export default FirestoreConnection;