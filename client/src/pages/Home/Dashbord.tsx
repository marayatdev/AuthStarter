import { Paper } from "@mantine/core";
import { Header } from "../../components/ui@layout/Header/Navbar";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

function Dashboard() {
  return (
    <>
      <Header />
      <Paper w={"80%"}>
        <Carousel
          slideSize="70%"
          height={200}
          slideGap="md"
          loop
          withControls={false}
          withIndicators
        >
          <Carousel.Slide bg={"blue"}>1</Carousel.Slide>
          <Carousel.Slide bg={"blue"}>2</Carousel.Slide>
          <Carousel.Slide bg={"blue"}>3</Carousel.Slide>
        </Carousel>
      </Paper>
    </>
    // <div>
    //   Dashboard
    //   <p>
    //     Welcome, {user.username} {user.role}!
    //   </p>
    //   {user.email && <p>Email: {user.email}</p>}
    //   {user.imageProfile && (
    //     <img
    //       src={`http://localhost:3000/api/media/${user.imageProfile}`}
    //       alt="Profile"
    //     />
    //   )}
    // </div>
  );
}

export default Dashboard;
