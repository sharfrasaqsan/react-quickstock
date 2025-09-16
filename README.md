# React QuickStock

React QuickStock is a web application designed to help you manage your inventory efficiently. Track stock levels, set low stock alerts, and monitor recent activity to ensure you never run out or overstock.

## Features and Functionality

*   **Dashboard:** Provides a quick overview of your inventory, including total SKUs, total units, low stock items, and stockouts.
*   **Items List:** View, search, and filter your inventory items.
*   **Add Item:** Easily add new items to your inventory with details like name, stock, low stock threshold, and unit.
*   **Edit Item:** Update the details of existing inventory items.
*   **Update Stock:** Quickly adjust the stock levels of items directly from the item list.
*   **Logs:** Track all inventory changes, including additions, updates, and deletions, with user information and timestamps. (Admin/Manager role only)
*   **User Authentication:** Secure login and registration with email and password.
*   **User Roles:** Different roles (admin, manager, worker) with varying permissions.
*   **Profile Management:** View user profile details, including name, email, role, and join date.
*   **Search and Filtering:**  Easily find items using search by name or ID and filter by stock status (all, in stock, low stock, out of stock).
*   **Real-time Updates:** Utilizes Firebase Firestore's `onSnapshot` to provide real-time updates of items and logs.

## Technology Stack

*   **React:**  A JavaScript library for building user interfaces.
*   **React Router:**  A standard library for routing in React.
*   **Firebase:** A backend platform for authentication and data storage.
    *   **Firebase Authentication:** For user authentication.
    *   **Firebase Firestore:**  For storing inventory data and logs.
*   **React Bootstrap:** A UI library for styling components.
*   **Sonner:** A toast notification library.
*   **JavaScript:** Programming language.
*   **CSS:**  For styling.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (version 14 or higher) - [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Node Package Manager) or **yarn:**
*   **Firebase Account:**  You'll need a Firebase project to configure the application.

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sharfrasaqsan/react-quickstock.git
    cd react-quickstock
    ```

2.  **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    or using yarn:

    ```bash
    yarn install
    ```

3.  **Configure Firebase:**

    *   Create a Firebase project in the Firebase Console ([https://console.firebase.google.com/](https://console.firebase.google.com/)).
    *   Enable Authentication (Email/Password).
    *   Create a Firestore database.
    *   Obtain your Firebase configuration object.  This object will contain `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, and `measurementId`.
    *   Replace the placeholder values in `src/firebase/Config.js` with your actual Firebase configuration:

        ```javascript
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
          measurementId: "YOUR_MEASUREMENT_ID"
        };
        ```

4.  **Environment Variables (Optional):**  While the Firebase config is directly in the code, for more sensitive information (like API keys in a production environment), consider using environment variables.  Create a `.env` file in the root of your project and access the variables using `process.env.VARIABLE_NAME`. You would then need to modify `src/firebase/Config.js` to use these variables. *Note: This project doesn't currently use environment variables, but it's a best practice to keep in mind.*

## Usage Guide

1.  **Start the development server:**

    Using npm:

    ```bash
    npm start
    ```

    or using yarn:

    ```bash
    yarn start
    ```

2.  **Open the application in your browser:**

    Go to `http://localhost:3000` (or the address shown in your terminal).

3.  **Register or Login:**

    *   If you don't have an account, click on "Register" and fill in the required details.
    *   If you already have an account, click on "Login" and enter your email and password.

4.  **Manage Inventory:**

    *   Use the Navbar to navigate to the different sections: Dashboard, Items, and Logs (if you have admin/manager role).
    *   On the Dashboard, you can see a summary of your inventory.
    *   On the Items page, you can view, search, filter, add, edit, and update the stock levels of your items.
    *   The Logs page (admin/manager only) allows you to track all changes made to the inventory.

## API Documentation

This project uses Firebase Firestore as its database, and there is no separate REST API. All data fetching and manipulation are done directly through the Firebase SDK within the React components.

The main interaction points with Firebase are within the following files:

*   `src/firebase/Config.js`: Initializes the Firebase app and exports the `auth` and `db` instances.
*   `src/contexts/DataContext.js`: Fetches and manages item, user, and log data using Firebase Firestore's `getDocs` and `onSnapshot` methods.
*   `src/pages/AddItem.js`, `src/pages/EditItem.js`, `src/components/items/ItemsCard.js`: These files contain the logic for adding, updating, and deleting items in Firestore, respectively, using `addDoc`, `updateDoc`, and `deleteDoc`.
*   `src/contexts/AuthContext.js`: Uses Firebase Authentication to manage user authentication state.

Refer to the official Firebase documentation for more details on the Firebase SDK: [https://firebase.google.com/docs](https://firebase.google.com/docs)

## Contributing Guidelines

Contributions are welcome! To contribute to React QuickStock, follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Test your changes thoroughly.
5.  Submit a pull request to the `main` branch.

Please adhere to the existing code style and conventions.

## License Information

License not specified. All rights reserved by the repository owner.

## Contact/Support Information

For questions, bug reports, or feature requests, please contact [sharfrasaqsan](https://github.com/sharfrasaqsan) by creating an issue on the GitHub repository.