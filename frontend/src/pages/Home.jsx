import React, { useContext } from "react";
import Nav from "../Components/Nav";
import Card from "../Components/Card";
import { listingDataContext } from "../Context/ListingContext";

function Home() {
  let { listingData, setListingData, newListData } =
    useContext(listingDataContext);
  return (
    <>
      <div className="">
        <Nav />
        <div className="w-[100vw] h-[77vh] flex items-center justify-start mx-[40px] gap-[25px] flex-wrap mt-[250px] md:mt-[180px]">
          {newListData.map((list) => (
            <Card
              title={list.title}
              landmark={list.landMark}
              city={list.city}
              image1={list.image1}
              image2={list.image2}
              image3={list.image3}
              rent={list.rent}
              id={list._id}
              key={list._id}
              ratings={list.ratings}
              isBooked={list.isBooked}
              host={list.host}
              guest={list.guest}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
