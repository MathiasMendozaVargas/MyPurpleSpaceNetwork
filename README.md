# My Purple Space Social Media App 💜

Welcome to My Purple Space, a social media app built with React.js, Supabase, and vanilla CSS. This app allows users to create accounts using their email addresses and set up passwords. Once logged in, users can explore various sections within the app, each offering unique functionalities to enhance their social media experience. 🚀🔮🌟

## Features 🚀

### Home Page 🏠
<p align="center"><img src="https://ik.imagekit.io/r67xuhpwk/Screenshot%202023-11-01%20105848.png?updatedAt=1698892074758" alt="project-image"></p>
- The Home Page displays posts from the app.
- Users can scroll through and interact with posts, including liking, disliking, and commenting.

### Profile Page 📝
<img src="https://ik.imagekit.io/r67xuhpwk/Screenshot%202023-11-01%20112009.png?updatedAt=1698892105657" width='30%'>
- The Profile Page is personalized for each user.
- Users can view their own profile, edit their profile information, upload new posts, and switch between viewing their own posts and saved posts.

### Friends Page 👫
<img src="https://github.com/MathiasMendozaVargas/mypurplespace/blob/main/friendsPage.gif" width='30%'>
- The Friends Page displays the current user's friends.
- Each friend is presented as a Friend Card component, showcasing their information, profile picture, and an option to delete the friend.

### Edit Profile Page 🖋️
<img src="https://ik.imagekit.io/r67xuhpwk/Screenshot%202023-11-01%20135319.png?updatedAt=1698893206048" width='30%'>
- Users can update their profile information, including username, first name, last name, gender, age, and profile photo.

## Main Components and Modals 🔍

### Post Card Component 📃
<img src="https://ik.imagekit.io/r67xuhpwk/Screenshot%202023-11-01%20194918.png?updatedAt=1698893402328" width='30%'>

- Displays the author's username, profile photo, and the date of the post.
- Features an options icon that opens a modal with custom functions, depending on the user's authority over the post.
- Shows the post content, including text and emojis.
- Displays post images if the user has included one.
- Offers like, dislike, and comment buttons, each indicating the number of corresponding interactions on the post.

### Create Post Modal 📝
<img src="https://ik.imagekit.io/r67xuhpwk/Screenshot%202023-11-01%20195651.png?updatedAt=1698893868000" width='30%'>

- Allows users to create and publish new posts.

### Edit Profile Photo Modal 📸
<img src="https://github.com/MathiasMendozaVargas/mypurplespace/blob/main/EditProfilePhoto.gif" width='30%'>
- Enables users to update their profile photo.

### Edit Post Modal 📝
<img src="https://github.com/MathiasMendozaVargas/mypurplespace/blob/main/EditPost.gif" width='30%'>
- Allows users to edit and update their existing posts.

## Installation 🛠️

To run My Purple Space on your local machine, follow these steps:

1. Clone this repository to your local system:

   ```
   git clone https://github.com/your-username/my-purple-space.git
   ```

2. Change directory to the project folder:

   ```
   cd my-purple-space
   ```

3. Install the required dependencies:

   ```
   npm install
   ```

4. Set up a Supabase project and obtain the necessary credentials. Update the Supabase configuration in the app.

5. Start the development server:

   ```
   npm start
   ```

The app should now be running locally, and you can access it at `http://localhost:3000`.

## Live Demo 🌐

You can explore My Purple Space in action by visiting our  <a href="https://mypurplespace.netlify.app/" target="_blank">live demo</a>.

## Technologies Used 💻

<img src='https://skillicons.dev/icons?i=react' width='30px'> React.js: Front-end framework for building the user interface.
<img src='https://skillicons.dev/icons?i=supabase' width='30px'> Supabase: Backend-as-a-Service to handle user authentication and data storage.
- Vanilla CSS: Custom styling for a unique app design.

## Contributing 🤝

We welcome contributions to My Purple Space! If you'd like to enhance or fix any part of the app, please follow our [contributing guidelines](CONTRIBUTING.md).

## License 📜

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Happy socializing in your own Purple Space! 💜🚀