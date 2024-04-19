import Talk from 'talkjs';
import { useAuthContext } from "@/src/context/AuthContext";
import firebase_app from '@/src/firebase/config';
import { getFirestore, collection, query, where, getDocs} from "firebase/firestore";
import { Button } from "../../(components)/mui";
import { useState, useRef, useEffect } from "react";

export default async function Chat({ item }) {
    const [talkLoaded, markTalkLoaded] = useState(false);
    const { user } = useAuthContext();
    const chatboxEl = useRef();

    useEffect(() => {
        const logic = async() => {
            const sellerId = item.uid;
            const itemId = item.itemId;
            console.log(sellerId);
            //Get buyer data
            const db = getFirestore(firebase_app);
            const productDocs = query(collection(db, "users"), where("email", "==", user.email));
            const docSnapshots = await getDocs(productDocs);
            const products = docSnapshots.docs.map(doc => doc.data());
            const buyerUsername = products.map((user) => user.username);
            const buyerId = products.map((user) => user.uid);
            const buyerEmail = products.map((user) => user.email);
    
            //Get seller data
            const userDocs = query(collection(db, "users"), where("uid", "==", sellerId));
            const userSnapshots = await getDocs(userDocs);
            const sellerData = userSnapshots.docs.map(doc => doc.data());
            const sellerUsername = sellerData.map((user) => user.username);
            const sellerEmail = sellerData.map((user) => user.email);
    
            //Start the chat feature
            Talk.ready.then(() => markTalkLoaded(true));
            
            if (talkLoaded) {
                const currentUser = new Talk.User({
                    id: `${buyerId}`,
                    name: `${buyerUsername}`,
                    email: `${buyerEmail}`,
                    welcomeMessage: 'Hello!',
                    role: 'default',
                });
    
                const otherUser = new Talk.User({
                    id: `${itemId}`,
                    name: `${sellerUsername}`,
                    email: `${sellerEmail}`,
                    welcomeMessage: 'Hello!',
                    role: 'default',
                });
    
                if (sellerId == buyerId) {
                    const session = new Talk.Session({
                        appId: 'tc22OyAn',
                        me: otherUser,
                    });
                    const inbox = session.createInbox();
                    inbox.mount(chatboxEl.current);
                } else {
                    const session = new Talk.Session({  
                        appId: 'tc22OyAn',
                        me: currentUser,
                    });
                    const conversationId = Talk.oneOnOneId(currentUser, otherUser);
                    const conversation = session.getOrCreateConversation(conversationId);
                    conversation.setParticipant(currentUser);
                    conversation.setParticipant(otherUser);
                    const chatbox = session.createChatbox();
                    chatbox.select(conversation);
                    chatbox.mount(chatboxEl.current);
                }
            }
        }
        if (user !== null) {
          logic();
        }
    }, [talkLoaded]);

    return (
        <div  style = {{height: "70vh", width: "100%" }} ref={chatboxEl} />
    );
}