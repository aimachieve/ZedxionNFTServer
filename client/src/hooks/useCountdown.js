import { useState, useEffect } from "react";
import { useSnackbar } from "notistack"
import { useNFTContract } from 'hooks/useContract'
// import { formatBigNumber } from 'utils/formatNumber';
import { MetamaskErrorMessage } from "utils/MetamaskErrorMessage";

// ----------------------------------------------------------------------

export default function useCountdown(date, tokenId) {
  console.log("tokenId=>", tokenId)
  const { enqueueSnackbar } = useSnackbar()
  const NFTContract = useNFTContract(process.env.REACT_APP_NFT_CONTRACT_ADDRESS)
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    window.interval = setInterval(() => setNewTime(), 1000);
    return () => clearInterval(window.interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNewTime = async () => {
    const startTime = new Date();
    const endTime = date;
    const distanceToNow = endTime - startTime;
    if (distanceToNow <= 0) {
      clearInterval(window.interval)
      setCountdown({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });

      try {
        await NFTContract.auctionDone(tokenId);

        enqueueSnackbar(`The auction of NFT(${tokenId}) is ended !`, {
          variant: "success",
        });
      } catch (error) {
        console.log("Error:", error);
        enqueueSnackbar(MetamaskErrorMessage(error), {
          variant: "error"
        })
      }
    } else {
      const getDays = Math.floor(distanceToNow / (1000 * 60 * 60 * 24));
      const getHours = `0${Math.floor(
        (distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )}`.slice(-2);
      const getMinutes = `0${Math.floor(
        (distanceToNow % (1000 * 60 * 60)) / (1000 * 60)
      )}`.slice(-2);
      const getSeconds = `0${Math.floor(
        (distanceToNow % (1000 * 60)) / 1000
      )}`.slice(-2);

      setCountdown({
        days: getDays || "00",
        hours: getHours || "00",
        minutes: getMinutes || "00",
        seconds: getSeconds || "00",
      });
    }
  };

  return countdown;
}

// Usage
// const countdown = useCountdown(new Date('07/07/2022 21:30'));
