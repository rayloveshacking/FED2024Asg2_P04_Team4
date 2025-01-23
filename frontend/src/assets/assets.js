import p_img1 from './websiteicon.png'
import p_img2 from './dellinspiron.jpg'
import p_img3 from './gamingpc.jpg'

export const assets = {
    p_img1,
    p_img2,
    p_img3,
}

export const products = [
    {
        _id: "aaaaa",
        name: "Dell Inspiron 15 3000",
        descrption:'A lightweight laptop with a 15.6" display',
        price: 500,
        image:[p_img2],
        category: "SecondHand",
        subCategory: 'Laptop',
        countInStock: 10,
        date: new Date(),
        bestseller: true,
    },
    {
        _id: "bbbbb",
        name: "Gaming PC RTX 3080",
        descrption:'A powerful gaming PC with an RTX 3080 graphics card',
        price: 1500,
        image:[p_img3],
        category: "New",
        subCategory: 'Gaming PC',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },
    

]