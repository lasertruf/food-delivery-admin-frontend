import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, query, where, doc, getDoc, docData, getDocFromServer, updateDoc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export type CollectionName = 'restaurants' | 'menus';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  constructor() {
    
  }
 
  getDataFor(collectionName:'restaurants' | 'menus') : Observable<any> {
    const menusCollection = collection(this.firestore, collectionName);
    return collectionData<any>(menusCollection,{idField:'id'});
  }

  getMenuById(menuRef: any) : Promise<any> {

    return  getDocFromServer(menuRef);

    }


    getRestaurantById(id:string) : Promise<any>{
      const ref = doc(this.firestore, `restaurants/${id}`);
      return getDocFromServer(ref)
    }

    addData(data:any, collectionName:CollectionName) : Promise<any> {
      const ref = collection(this.firestore, collectionName)
      return addDoc(ref,data)
    } 

    updateData(data:any, collectionName:CollectionName, docId:any) : Promise<any> {
      const ref = doc(this.firestore, `${collectionName}/${docId}`)
      return updateDoc(ref,data) 
    } 

    updateDataByRef(data:any, docRef:any) : Promise<any> {
      return updateDoc(docRef,data) 
    } 


    getDocByRef(docRef:any) : Observable<any> {
      return docData(docRef, {idField:'id'});
    }

    deleteDocById(docId:any, collectionName:CollectionName) : Promise<any> {
      let ref = doc(this.firestore,`${collectionName}/${docId}`)
      return deleteDoc(ref)
    }

    deleteDocByRef(docRef:any) : Promise<any> {
      return deleteDoc(docRef)
    }
}
