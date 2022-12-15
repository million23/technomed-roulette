import { useEffect, useState } from "react";

import Lottie from "lottie-react";
import __Confetti from "../public/confetti.json";
import __Fireworks from "../public/fireworks.json";
import { motion } from "framer-motion";
import randomNumber from "random-number-csprng";
import { useParticipants } from "../components/ParticipantsContext";
import { useRouter } from "next/router";

const RoulettePage = () => {
  const router = useRouter();
  const [rouletteData, setRouletteData] = useState([]);
  const [roll, setRoll] = useState({});
  const [animatedRoll, setAnimatedRoll] = useState({});
  const { participants } = useParticipants();

  const rollRoulette = async () => {
    const soundEffect = new Audio("/rouletteResult.wav");
    const result = await randomNumber(0, rouletteData.length - 1);

    soundEffect.play();
    setRoll({});

    if (!soundEffect.paused) {
      let index = 0;

      const rolling = setInterval(() => {
        index++;
        if (index === rouletteData.length) {
          index = 0;
        }

        setAnimatedRoll(rouletteData[index]);
      }, 10);

      setTimeout(() => {
        clearInterval(rolling);

        setRoll(rouletteData[result]);
        setAnimatedRoll({});
      }, 4450);
    }
  };

  const loadData = () => {
    let localParticipants = JSON.parse(sessionStorage.getItem("participants"));

    if (localParticipants) {
      setRouletteData(localParticipants);
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
        // scale: [0.5, 1, 1, 0.9]
        <motion.div
          animate={{
            opacity: [0, 1, 1, 1],
            y: [-200, 0, 0, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{ ease: [0, 1, 1, 0.5], duration: 5 }}
          className="text-center"
        >
          {/* <h1 className="text-4xl font-bold mb-5">{animatedRoll.name}</h1> */}
          <img
            src={animatedRoll.image}
            alt={animatedRoll.name}
            className="border-2 border-primary rounded-md w-[300px] h-[300px] mx-auto"
          />
        </motion.div>
      )}
      {roll?.name && (
        <>
          <div className="text-center relative flex flex-col justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: [0.11, 1.7, 0.28, 0.97], duration: 0.5 }}
              className="flex flex-col items-center justify-center relative"
            >
              <img
                src={roll.image}
                alt={roll.name}
                className="border-2 border-primary rounded-md w-[300px] h-[300px] mx-auto"
              />
              <h1 className="text-4xl font-bold mt-5">{roll.name}</h1>

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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "circOut", duration: 0.5, delay: 3 }}
              className="grid grid-cols-2 gap-2 items-center w-full mt-16"
            >
              <button
                onClick={() => {
                  const newRouletteData = rouletteData.filter(
                    (item) => item.name !== roll.name
                  );
                  setRouletteData(newRouletteData);
                  sessionStorage.setItem(
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
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoulettePage;
