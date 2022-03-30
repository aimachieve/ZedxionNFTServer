// material
import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";
// hooks
import useCountdown from "hooks/useCountdown";

// ----------------------------------------------------------------------

// const RootStyle = styled(Page)(({ theme }) => ({
//   minHeight: "100%",
//   display: "flex",
//   alignItems: "center",
//   paddingTop: theme.spacing(15),
//   paddingBottom: theme.spacing(10),
// }));

const CountdownStyle = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
  // margin: theme.spacing(0, 1),
  [theme.breakpoints.up("sm")]: {
    margin: theme.spacing(0, 2.5),
  },
}));

// ----------------------------------------------------------------------

export default function ComingSoon({day, tokenId}) {
  const countdown = useCountdown(new Date(day), tokenId);

  return (
    <Container>
      <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
        <CountdownStyle>
          <div>
            <Typography variant="h4">{countdown.days}</Typography>
            <Typography sx={{ color: "text.secondary" }}>Days</Typography>
          </div>

          <SeparatorStyle variant="h4">:</SeparatorStyle>

          <div>
            <Typography variant="h4">{countdown.hours}</Typography>
            <Typography sx={{ color: "text.secondary" }}>Hours</Typography>
          </div>

          <SeparatorStyle variant="h4">:</SeparatorStyle>

          <div>
            <Typography variant="h4">{countdown.minutes}</Typography>
            <Typography sx={{ color: "text.secondary" }}>Minutes</Typography>
          </div>

          <SeparatorStyle variant="h4">:</SeparatorStyle>

          <div>
            <Typography variant="h4">{countdown.seconds}</Typography>
            <Typography sx={{ color: "text.secondary" }}>Seconds</Typography>
          </div>
        </CountdownStyle>
      </Box>
    </Container>
  );
}
