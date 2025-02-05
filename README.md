# MokeSell: Premium Ecommerce Store

Mokesell is a premium ecommerce online store that will bring the latest products from brand new arrivals to high quality refurbished products. Built with React and Vite, MokeSell offers a smooth, responsive shopping experience with advanced features such as product bumping, saved listings and real time order tracking. Our mission is to make online shopping both enjoyable and efficient for every user.

## Design Process

Our design process began with understanding our target users: tech-savvy shoppers looking for high-quality products at competitive prices. We wanted to create an intuitive interface that guides users effortlessly from browsing to purchase.

### User Stories
- **As a customer**, I want to browse through the latest products, so that I can easily discover new arrivals.
- **As a returning customer**, I want to save my favorite listings, so that I can quickly access them later.
- **As a seller**, I want to promote my listings through bumping, so that my products are more visible to potential buyers.
- **As a user**, I want to quickly search for products by category or keyword, so that I can find exactly what I need.

For design mockups and wireframes, please visit our [Figma URL](https://www.figma.com/design/X0YQobElMEi842E337nc9y/FED_Assg2_Prototype?node-id=0-1&p=f&t=sJzWRKR2cZiTIKr4-0).

## Features

### Existing Features
- **Responsive Layout:** Uses Tailwind CSS for a responsive design that works on all devices.
- **Product Browsing:** Users can browse new and refurbished collections with dynamic filtering and sorting.
- **User Authentication:** Customers and sellers can sign in, register, and manage their profiles.
- **Saved Listings:** Users can save and manage their favorite listings.
- **Promotional Bumping:** Sellers can bump listings to increase visibility.
- **Real-time Cart & Order Management:** Using Firebase for real-time updates, users can manage their cart and track orders.
- **Lottie Animations:** Engaging animations for events like account creation and homepage visuals.
-**Following Between Users:** Users can follow sellers and see their latest listings as well as their specific listings.
-**Create Listings:** Sellers can upload their products using our seller dashboard to easily sell their products.
-**Active Listings:** Listings wil automatically become inactive after 30 days so that the website is clean.


### Features Left to Implement


## Technologies Used

- [React](https://reactjs.org)  
  The primary framework used to build the user interface.
  
- [Vite](https://vitejs.dev)  
  Provides a fast development server and optimized build process.
  
- [Firebase](https://firebase.google.com)  
  Used for authentication, real-time database (Firestore), and hosting features.

- [Cloudinary](https://cloudinary.com/)  
  Used for storing and retrieving images accordingly.
  
- [Tailwind CSS](https://tailwindcss.com)  
  Enables rapid UI development with utility-first CSS classes.
  
- [Lottie React](https://github.com/chenqingspring/react-lottie)  
  Used to render high-quality Lottie animations for interactive UI elements.
  
- [GitHub Pages](https://pages.github.com)  
  For hosting the production build of the application.

## Assistive AI

We have leveraged AI tools to enhance our development process.

1. **Firebase Query Optimization:**  
   ChatGPT assisted in structuring our Firestore queries and composite indexes by providing guidance and creating code to check active listings count.

  <img width="552" alt="image" src="https://github.com/user-attachments/assets/792d2146-be08-4bdd-b09d-0e018f2f6c9a" />

   
2. **Listening for Authentication Changes and loading carts**  
   ChatGpt assisted in creating carts for different users and ensuring that different users will get their own unique carts with their own items. It assisted in updating the cart in firebase as well with the following code snippets.

   <img width="529" alt="image" src="https://github.com/user-attachments/assets/b9f6ee73-b99d-4ec6-a6b2-e58b3d39c5b9" />
<img width="578" alt="image" src="https://github.com/user-attachments/assets/338e17cd-823d-4242-86aa-04ec06800cbd" />

   
3. **Fetching a product from firebase**  
   We used ChatGPT to handle asynchronous data fetching and conditional rendering while ensuring a smooth experience as well as managing an image gallery and dynamically fetching products from firebase based on the url parameter with the following code snippets:

<img width="590" alt="image" src="https://github.com/user-attachments/assets/a5bc1c2a-6e46-4ea6-a3ce-132d0a995c13" />

## Testing

### Manual Testing Scenarios

1. **Contact Form:**
   - Navigate to the "Contact Us" page.
   - Attempt to submit the form empty; verify that error messages appear for required fields.
   - Enter an invalid email address and submit; verify that a relevant error message appears.
   - Enter valid information and submit; verify that a success message is shown.
   
2. **User Authentication:**
   - Register a new account and ensure that the Lottie animation for successful account creation plays.
   - Log in and check that the user dashboard displays correctly.
   
3. **Product Interaction:**
   - Add products to the cart and verify that the total price updates correctly.
   - Test the "Bump Listing" feature for sellers to ensure the listing order updates.
   
4. **Responsive Design:**
   - Verify that the website displays correctly on various devices and screen sizes.
   - Test on multiple browsers (Chrome, Firefox, Safari) to ensure compatibility.

During testing, we discovered minor layout issues on smaller screens, which have been noted for future updates.

## Credits

### Content
- Some of the descriptive content was inspired by industry-standard e-commerce platforms and adapted for our project.
-Those platforms are: [Carousell](https://www.carousell.sg/) which is our main inspiration and [Shopee](https://shopee.sg/)

### Media
- Product images are sourced from royalty-free image repositories.
- Lottie animations are downloaded from [LottieFiles](https://lottiefiles.com) and are used under their licensing terms.

### Acknowledgements
- Special thanks to Bhaveesh for his insights and support.
- Inspired by various e-commerce sites and best practices in UI/UX design.

## Visit our website:
-[MokeSell](https://rayloveshacking.github.io/FED2024Asg2_P04_Team4/)
