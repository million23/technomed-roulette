import { useEffect, useState } from "react";

import Lottie from "lottie-react";
import __Confetti from "../public/confetti.json";
import __Fireworks from "../public/fireworks.json";
import { useRouter } from "next/router";

const RoulettePage = () => {
  const router = useRouter();
  const [rouletteData, setRouletteData] = useState([]);
  const [roll, setRoll] = useState({});
  const [animatedRoll, setAnimatedRoll] = useState({});

  const rollRoulette = () => {
    setRoll({});
    for (let index = 0; index < 50; index++) {
      setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * rouletteData.length);
        setAnimatedRoll(rouletteData[randomIndex]);

        if (index === 49) {
          setRoll(rouletteData[randomIndex]);
          setAnimatedRoll({});
        }
      }, 100 * index);
    }
  };

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("participants"));
    if (data) {
      setRouletteData(data);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center">
      {!animatedRoll?.name && !roll?.name && (
        <button onClick={rollRoulette} className="btn btn-primary btn-block">
          Spin Roulette
        </button>
      )}

      {animatedRoll?.name && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">{animatedRoll.name}</h1>
          <img
            src={animatedRoll.image}
            alt={animatedRoll.name}
            className="rounded-full w-32 h-32 mx-auto"
          />
        </div>
      )}
      {roll?.name && (
        <>
          <div className="text-center relative flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center py-32 relative">
              <h1 className="text-2xl font-bold">{roll.name}</h1>
              <img
                src={roll.image}
                alt={roll.name}
                className="rounded-full w-32 h-32 mx-auto"
              />

              <Lottie
                loop={false}
                animationData={__Confetti}
                className="fixed top-0 left-0 w-full h-full -z-10"
              />
              <Lottie
                loop={false}
                animationData={__Fireworks}
                className="fixed top-0 left-0 w-full h-full -z-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 items-center w-full">
              <button
                onClick={() => {
                  const newRouletteData = rouletteData.filter(
                    (item) => item.name !== roll.name
                  );
                  setRouletteData(newRouletteData);
                  localStorage.setItem(
                    "participants",
                    JSON.stringify(newRouletteData)
                  );
                  setRoll({});
                }}
                className="btn btn-primary "
              >
                Remove Winner
              </button>
              <button onClick={rollRoulette} className="btn btn-primary ">
                Re-roll
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoulettePage;
