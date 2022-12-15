import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useParticipants } from "../components/ParticipantsContext";
import { useRef } from "react";
import { useState } from "react";

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { participants, setParticipants } = useParticipants();

  const getVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 500, height: 500 } })
      .then((stream) => {
        let vid = videoRef.current;
        vid.srcObject = stream;
        vid.play();
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let name = e.target[0].value;

    if (name.length > 0) {
      let firstLetterUpperCase = name.charAt(0).toUpperCase();
      let restOfName = name.slice(1);
      name = firstLetterUpperCase + restOfName;
      let canvas = canvasRef.current;
      let ctx = canvas.getContext("2d");
      let video = videoRef.current;
      ctx.drawImage(video, -70, 0, 650, 500);

      let image = canvas.toDataURL("image/png");
      const localParticipants = [...participants, { name, image }];
      setParticipants(localParticipants);

      e.target[0].value = "";

      sessionStorage.setItem("participants", JSON.stringify(localParticipants));
    }
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <>
      <div className="py-24">
        <p className="text-2xl text-center font-bold">
          Technomed Christmas Party Roulette
        </p>

        <video
          ref={videoRef}
          width={300}
          height={226}
          className=" mx-auto mt-4 border-2 border-primary w-[300px] h-[300px] object-cover object-center"
        >
          Video stream not available.
        </video>
        <p className="text-center max-w-lg mx-auto">
          Please place your head at the center of the frame, type your name, and
          click submit. You can remove the participant by clicking on their
          photo below
        </p>

        <form onSubmit={handleSubmit} className="text-center mt-10">
          <label className="text-center">Enter your name</label>
          <input className="input input-primary w-full text-center" />

          <button className="btn btn-primary btn-block mt-5">
            <span>Submit</span>
          </button>
        </form>

        <canvas
          id="canvas"
          ref={canvasRef}
          className="hidden"
          width={500}
          height={500}
        />

        {participants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {participants.map((participant, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, ease: "circOut" }}
                onClick={() => {
                  const filteredParticipants = participants.filter(
                    (p) => p.name !== participant.name
                  );
                  setParticipants(filteredParticipants);
                  sessionStorage.setItem(
                    "participants",
                    JSON.stringify(filteredParticipants)
                  );
                }}
                key={index}
                className="flex flex-col items-center hover:opacity-50 cursor-pointer transition-all"
              >
                <img
                  src={participant.image}
                  className="w-[100px] h-[100px] object-cover object-center"
                />
                <p className="text-center mt-2">{participant.name}</p>
              </motion.div>
            ))}
          </div>
        )}

        {participants.length > 1 && (
          <Link href={"/roulette"} className="btn btn-primary btn-block mt-5">
            <span>Spin Roulette</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default HomePage;
