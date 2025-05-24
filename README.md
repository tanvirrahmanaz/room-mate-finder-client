# Room Mate Finder - Client

A modern web application for finding and connecting with potential roommates. Built with React, Vite, and Tailwind CSS.

## Live Demo
[Room Mate Finder](https://room-mate-finderbd.web.app/)

## Features

- 🔐 **Secure Authentication**
  - User registration and login functionality
  - Protected routes for authenticated users
  - Secure session management

- 🏠 **Advanced Room Listing System**
  - Create, view, and manage room listings
  - Detailed room information including location, price, and amenities
  - Image upload support for room listings
  - Real-time availability status

- 🔍 **Smart Search & Filtering**
  - Advanced search functionality with multiple filters
  - Filter by location, price range, and room type
  - Sort listings by newest, price, and popularity
  - Real-time search results

- 💬 **Interactive Features**
  - Like and save favorite listings
  - Contact room owners directly
  - View detailed room information
  - Responsive design for all devices

- 🌓 **Modern UI/UX**
  - Dark/Light theme support
  - Responsive design for mobile and desktop
  - Intuitive navigation
  - Loading states and error handling

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- React Icons
- React Hot Toast
- Axios

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/room-mate-finder-client.git
```

2. Install dependencies
```bash
cd room-mate-finder-client
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
room-mate-finder-client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React context providers
│   ├── pages/         # Page components
│   ├── routes/        # Route configurations
│   ├── utils/         # Utility functions
│   └── App.jsx        # Root component
├── public/            # Static assets
└── index.html         # Entry HTML file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
