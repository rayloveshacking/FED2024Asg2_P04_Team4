import { createContext, useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [refurbishedProducts, setRefurbishedProducts] = useState([]);
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const qNew = query(collection(db, 'products'), where('type', '==', 'new'));
        const unsubNew = onSnapshot(qNew, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qRefurb = query(collection(db, 'products'), where('type', '==', 'refurbished'));
        const unsubRefurb = onSnapshot(qRefurb, (snapshot) => {
            setRefurbishedProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubNew();
            unsubRefurb();
        };
    }, []);

    const value = {
        products,
        refurbishedProducts,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;