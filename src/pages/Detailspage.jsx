// src/pages/DetailsPage.jsx
import { useParams } from 'react-router-dom';

const DetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="p-10 text-center">
      <h1 className="text-xl font-bold">Details Page</h1>
      <p>Coming soon for listing ID: {id}</p>
    </div>
  );
};

export default DetailsPage;
