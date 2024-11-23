"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";
// import Image from "next/image";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const lastPhotoElementRef = useRef(null);

  // const server = useRef();

  // Fetch images from Unsplash API
  const fetchPhotos = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&count=10&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setLoading(false);
    }
  };

  // Infinite Scroll using Intersection server
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const currentObserver = new IntersectionObserver(callback, options);

    if (lastPhotoElementRef.current) {
      currentObserver.observe(lastPhotoElementRef.current);
    }

    return () => {
      if (lastPhotoElementRef.current) {
        currentObserver.unobserve(lastPhotoElementRef.current);
      }
    };
  }, [loading]);

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  return (
    <div className="photo-card">
      {photos?.map((photo, index) => (
        <div key={index}>
          <img
            src={photo?.urls?.small}
            alt={photo.alt_description}
            width={300}
            height={150}
          />
          <p className="description">{`${photo?.user?.first_name}  ${photo?.user?.last_name}`}</p>
        </div>
      ))}
      {loading && <div className="">Loading...</div>}
      <div ref={lastPhotoElementRef}></div>
    </div>
  );
};

export default PhotoGallery;
