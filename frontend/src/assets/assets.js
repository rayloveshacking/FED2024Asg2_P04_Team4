import logo from './websiteicon.png'
import p_img2 from './dellinspiron.jpg'
import p_img3 from './gamingpc.jpg'
import p_img4 from './oldm1.png'
import p_img5 from './samsungs25.jpg'
import p_img6 from './ipad1.png'
import p_img7 from './kb1.jpg'
import p_img8 from './rk61.png'
import p_img9 from './logi.png'
import p_img10 from './4080.png'
import p_img11 from './tower.png'
import search_icon from './search_icpm.png'
import profile_icon from './profile_icon.png'
import cart_icon from './cart_icon.png'
import menu_icon from './menu_icon.png'
import dropdown_icon from './dropdown_icon.png'
import hero_img from './hero_img.jpg'
import exchange_icon from './exchange.png'
import quality_icon from './premium.png'
import support_img from './support.png'
import dropdown_icon1 from './dropdown1.png'

export const assets = {
    logo,
    p_img2,
    p_img3,
    search_icon,
    profile_icon,
    cart_icon,
    menu_icon,
    dropdown_icon,
    hero_img,
    p_img4,
    p_img5,
    p_img6,
    p_img7,
    p_img8,
    p_img9,
    p_img10,
    p_img11,
    exchange_icon,
    quality_icon,
    support_img,
    dropdown_icon1
}

export const products = [
    {
        _id: "aaaaa",
        name: "Asus Zephyrus G14",
        descrption:'A lightweight laptop with a 15.6" display',
        price: 500,
        image:[p_img2],
        category: "Computers",
        subCategory: 'Laptops',
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
        category: "Computers",
        subCategory: 'Desktops',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "ccccc",
        name: "Acer Nitro 5",
        descrption:'A powerful budget gaming PC with an RTX 3080 graphics card',
        price: 400,
        image:[p_img4],
        category: "Computers",
        subCategory: 'Laptops',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "ddddd",
        name: "Lenovo Thinkpad",
        descrption:'The toughest laptop in the market',
        price: 1000,
        image:[p_img6],
        category: "Computers",
        subCategory: 'Laptops',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "eeeee",
        name: "Samsung S25 Ultra",
        descrption:'The latest and greatest smartphone from samsung',
        price: 1200,
        image:[p_img5],
        category: "Mobile Devices",
        subCategory: 'Phone',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "fffff",
        name: "KeyChron K6",
        descrption:'A good sounding keyboard with a 65% layout',
        price: 500,
        image:[p_img7],
        category: "Accessories",
        subCategory: 'Keyboards',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "ggggg",
        name: "RK61",
        descrption:'The most popular 60% keyboard',
        price: 300,
        image:[p_img8],
        category: "Accessories",
        subCategory: 'Keyboards',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "hhhhh",
        name: "Logitch G Pro X Superlight",
        descrption:'A good gaming mouse with a 16k dpi sensor',
        price: 500,
        image:[p_img9],
        category: "Accessories",
        subCategory: 'Mouse',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "iiiii",
        name: "Gaming PC RTX 4080 with Liquid Cooling",
        descrption:'A powerful gaming PC with an RTX 4080 graphics card',
        price: 2500,
        image:[p_img10],
        category: "Computers",
        subCategory: 'Desktops',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },

    {
        _id: "jjjjj",
        name: "Lenovo Legion Tower 9i",
        descrption:'Simply a beast from lenovo meant to be the best',
        price: 4500,
        image:[p_img11],
        category: "Computers",
        subCategory: 'Desktops',
        countInStock: 2,
        date: new Date(),
        bestseller: true,
    },
    

]