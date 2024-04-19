import { getFirestore, collection, query, where, getDocs, orderBy, startAt, endAt} from "firebase/firestore";
import firebase_app from '../../firebase/config';
import ClientComponent from "./clientComponent";

export const dynamic = 'force-dynamic';

export default async function Page({searchParams}) {
    const price2 = searchParams.price || '';
    const searchQuery = searchParams.query || '';
    const sorted = searchParams.sort;
    const lb = price2.split('-')[0];
    const ub = price2.split('-')[1];
    let productDocs;
    const db = getFirestore(firebase_app);
    if (searchQuery != '' && searchQuery != 'all') {
        if (price2 === '' || price2 === 'all') {
            if (sorted === 'lowest') {
                productDocs = query(collection(db, "items"),
                where("itemTitle", "==", searchQuery),
                orderBy("price", "asc"));
            } else if (sorted === 'highest') {
                productDocs = query(collection(db, "items"),
                where("itemTitle", "==", searchQuery),
                orderBy("price", "desc"));
            } else {
                productDocs = query(collection(db, "items"),
                where("itemTitle", "==", searchQuery),
                orderBy("price", "asc"));
            }
        } else {
            if (sorted === 'lowest') {
                productDocs = query(collection(db, "items"),
                where("itemTitle", "==", searchQuery),
                where("price", ">=" , parseInt(lb)), 
                where("price", "<=" , parseInt(ub)),
                orderBy("price", "asc"));
            } else if (sorted === 'highest') {
                productDocs = query(collection(db, "items"),
                where("itemTitle", "==", searchQuery),
                where("price", ">=" , parseInt(lb)), 
                where("price", "<=" , parseInt(ub)),
                orderBy("price", "desc"));
            }  else {
                productDocs = query(collection(db, "items"),
                where("itemTitle", "==", searchQuery),
                where("price", ">=" , parseInt(lb)), 
                where("price", "<=" , parseInt(ub)),
                orderBy("price", "asc"));
            }
        }
    }else if (price2 === '' || price2 === 'all') {
        if (sorted === 'lowest') {
            productDocs = query(collection(db, "items"),
            orderBy("price", "asc"));
        } else if (sorted === 'highest') {
            productDocs = query(collection(db, "items"),
            orderBy("price", "desc"));
        } else {
            productDocs = query(collection(db, "items"),orderBy("price", "asc"));
        }
    } else {
      if (sorted === 'lowest') {
          productDocs = query(collection(db, "items"),
          where("price", ">=" , parseInt(lb)), 
          where("price", "<=" , parseInt(ub)),
          orderBy("price", "asc"));
      } else if (sorted === 'highest') {
          productDocs = query(collection(db, "items"),
          where("price", ">=" , parseInt(lb)), 
          where("price", "<=" , parseInt(ub)),
          orderBy("price", "desc"));
      }  else {
          productDocs = query(collection(db, "items"),
          where("price", ">=" , parseInt(lb)), 
          where("price", "<=" , parseInt(ub)),
          orderBy("price", "asc"));
      }
    }
    const docSnapshots = await getDocs(productDocs);
    const products = docSnapshots.docs.map(doc => doc.data());
    
    return (
        <ClientComponent products = {products}/>
    );
}

