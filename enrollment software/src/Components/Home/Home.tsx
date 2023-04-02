import img from "../Img/mat.png";
import { Heading } from '@chakra-ui/react'
const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
        <Heading>MatriFast</Heading>
      <img src={img} alt="user_photo" />
    </div>
  );
};

export default Home;
