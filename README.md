# MokeSell: Premium Ecommerce Store

Mokesell is a premium ecommerce online store that will bring the latest products from brand new arrivals to high quality refurbished products. Built with React and Vite, MokeSell offers a smooth, responsive shopping experience with advanced features such as product bumping, saved listings and real time order tracking. Our mission is to make online shopping both enjoyable and efficient for every user.

## Visit our website:
-[MokeSell](https://rayloveshacking.github.io/FED2024Asg2_P04_Team4/)

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
- **Following Between Users:** Users can follow sellers and see their latest listings as well as their specific listings.
- **Create Listings:** Sellers can upload their products using our seller dashboard to easily sell their products.
- **Active Listings:** Listings wil automatically become inactive after 30 days so that the website is clean.
- **User Rating and Reviews:** Users can rate and review products to build trust within the market place.
- **User Notifications:** Users receive notifications for new listings, offers and messages from the sellers to stay updated and be informed.
- **Chat Feature:** Users can talk to sellers about the items to ask various questions and establish a connection with the seller.
- **Gamification:** Users can get points and rewards for buying items or finding secret items scattered across the website.

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

4. **Storing and Fetching Images from Cloudinary**
   We used ChatGpt to assist us in fetching and storing images from cloudinary with this code snippet below:
   
<img width="574" alt="image" src="https://github.com/user-attachments/assets/8d7b0916-08cf-48e4-83b9-2b788557d7b6" />


Below is the updated testing documentation incorporating the latest changes to the website:

---

## Testing

### Manual Testing Scenarios

1. **Contact Form:**
   - Navigate to the "Contact Us" page.
   - Attempt to submit the form empty; verify that error messages appear for all required fields.
   - Enter an invalid email address and submit; verify that a relevant error message is shown.
   - Enter valid information and submit; verify that a success message is displayed.

2. **User Authentication & Registration:**
   - Register a new account and ensure that the Lottie animation for successful account creation plays.
   - Log in and verify that the user dashboard displays correctly.
   - Log out and confirm that protected pages (such as Chat and Profile) prompt for login.

3. **Product Interaction:**
   - Add products to the cart and verify that the total price updates correctly.
   - Test the "Bump Listing" feature on the seller dashboard to ensure that listings update their order as expected.
   - Use the Save Listing button to save and unsave products, confirming that the state updates appropriately.

4. **Chat Functionality & Notifications:**
   - Navigate to the Chats page and verify that each conversation displays the other participant’s name (not just their UID).
   - Open a chat conversation and send a message; verify that:
     - The message appears in the chat window in chronological order.
     - The recipient (the other participant) receives a notification with the correct sender details (name or email).
   - Refresh the chat pages to ensure messages load correctly.
   - When not logged in, confirm that both the Chats and ChatDetail pages display a fallback UI featuring a centered Lottie animation with a login prompt. (The vertical spacing should be reduced so that headers and footers are not pushed too far apart.)

5. **Responsive Design & Cross-Browser Compatibility:**
   - Verify that the website displays correctly on various devices and screen sizes.
   - Check that the header and footer remain consistently placed, even with the updated fallback UI for chat pages.
   - Test the site on multiple browsers (Chrome, Firefox, Safari) to ensure compatibility.

6. **Routing & Refresh Behavior (GitHub Pages):**
   - Navigate to different routes (e.g., home, new, refurbished) and verify that they load correctly.
   - Refresh the page on sub-routes (e.g., `/new`); if using BrowserRouter, confirm that appropriate fallback or redirection (or a custom 404 page) is implemented to handle refreshes on non-root URLs.

7. **Profile Nav Menu Testing:**
   - Created a new user with customer role and tested if the seller dashboard appears under the profile menu or not as the dashboard must only appear for the sellers..
   - Created a new user with seller role and test if the seller dashboard correctly appears everytime.

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
