import {
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  setDoc
} from "firebase/firestore"
import { database } from "./firebase"

// contact_name: firstName + " " + lastName,
// contact_person_lastname: lastName,
// contact_person_email: email,
// contact_person_first_name: firstName,
// usageperiod_end: end.toDate().toISOString(),
// usageperiod_start: start.toDate().toISOString(),
// in: new Date(
//   end.toDate().setDate(end.toDate().getDate() + 1),
// ).toISOString(),
// out: new Date(
//   start.toDate().setDate(start.toDate().getDate() - 1),
// ).toISOString(),
// name: projectName,
// external_reference: 0,
// remark: "string",
// planperiod_end: new Date(
//   end.toDate().setDate(end.toDate().getDate() + 1),
// ).toISOString(),
// planperiod_start: new Date(
//   start.toDate().setDate(start.toDate().getDate() - 1),
// ).toISOString(),
// price: getCartTotal(),

export const addOrder = async ({
  collection,
  userEmail,
  id,
  contact_name,
  contact_person_first_name,
  contact_person_lastname,
  contact_person_email,
  usageperiod_start,
  usageperiod_end,
  checkIn,
  checkOut,
  projectName,
  external_reference,
  remark,
  planperiod_start,
  planperiod_end,
  price,
  cart,
}) => {
  const userOrderRef = doc(database, collection, userEmail)
  try {
    await updateDoc(userOrderRef, {
      orders: arrayUnion({
        id: id,
        contact_name: contact_name,
        contact_person_first_name: contact_person_first_name,
        contact_person_lastname: contact_person_lastname,
        contact_person_email: contact_person_email,
        usageperiod_start: usageperiod_start,
        usageperiod_end: usageperiod_end,
        in: checkIn,
        out: checkOut,
        name: projectName,
        external_reference: external_reference,
        remark: remark,
        planperiod_start: planperiod_start,
        planperiod_end: planperiod_end,
        price: price,
        cart: cart,
      }),
    })
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}

export const addUser = async ({
  email,
  brentCollection,
  firstName,
  lastName
}) => {
  console.log(brentCollection)
  const userOrderRef = doc(database, brentCollection, email)
  try {
    await setDoc(userOrderRef, {
      email: email
    }).then(updateDoc(doc(database, brentCollection, email), {
      discount: "0",
      email: email,
      isAdmin: false,
      firstName: firstName ? firstName : "No name registered",
      lastName: lastName ? lastName : "",
      orders: [],
      savedOrders: {},
    }))
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}
export const addSavedOrders = async ({
  brentCollection,
  userEmail,
  object
}) => {
  await updateDoc(doc(database, brentCollection, userEmail), {
    savedOrders: {...object}
  });
  
  // const userOrderRef = doc(database, brentCollection, userEmail)
  // console.log(object)
  // try {
  //   await updateDoc(userOrderRef, {
  //     savedOrders: arrayUnion(
  //       {object}
  //     ),
  //   })
  // } catch (e) {
  //   console.error("Error adding document: ", e)
  // }

  
}




// const deleteListing = async () => {
//   try {
//     await updateDoc(listingRef, {
//       savedListings: arrayRemove("THAT_OBJECT")
//     });
//   } catch (e) {
//     console.log(e.message);
//   }
// };
export const deleteSavedOrder = async ({
  brentCollection,
  userEmail,
  object
}) => {
  const itemRef = doc(database, 'dagslys', 'test@test.com'); // USER_EMAIL is document ID
  await updateDoc(itemRef, {
    savedOrders: {...object}
  });
  
  // const userOrderRef = doc(database, brentCollection, userEmail)
  // console.log(object)
  // try {
  //   await updateDoc(userOrderRef, {
  //     savedOrders: arrayUnion(
  //       {object}
  //     ),
  //   })
  // } catch (e) {
  //   console.error("Error adding document: ", e)
  // }
}