import React from "react";

//Propriedad de mi Square
interface Props {
  onClick: () => void;
  card: String;
  image: String;
}
const Square = function (props: Props) {
  return (
    <button
      style={{
        backgroundImage: "url(" + "/assets/" + props.image + ".png" + ")", //Usar template
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "104px",
        height: "177px",
        backgroundRepeat: "no-repeat",
      }}
      onClick={props.onClick}
    >
      {props.card}
    </button> //Props.card me sirve para que la propriedad card, seteata en Game.tsx, sea el nombre de mi square
  );
};

export default Square;
