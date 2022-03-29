import { useRef } from 'react';
import Slider from 'react-slick';
import React from "react"
import PropTypes from 'prop-types';
// material
import { styled } from '@material-ui/core/styles';
import { Stack, Button, Box } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
// ----------------------------------------------------------------------

const MOCK_CAROUSELS = [
  {
    id: 1,
    title: 'Product 01',
    image: 'https://shreethemes.in/superex/layouts/images/items/1.jpg',
    description: 'Instruments'
  },
  {
    id: 2,
    title: 'Product 02',
    image: 'https://shreethemes.in/superex/layouts/images/items/2.jpg',
    description: 'Instruments'
  },
  {
    id: 3,
    title: 'Product 03',
    image: 'https://shreethemes.in/superex/layouts/images/items/3.jpg',
    description: 'Instruments'
  },
  {
    id: 4,
    title: 'Product 04',
    image: 'https://shreethemes.in/superex/layouts/images/items/4.jpg',
    description: 'Instruments'
  },
  {
    id: 5,
    title: 'Product 05',
    image: 'https://shreethemes.in/superex/layouts/images/items/5.jpg',
    description: 'Instruments'
  },
  {
    id: 6,
    title: 'Product 06',
    image: 'https://shreethemes.in/superex/layouts/images/items/6.jpg',
    description: 'Instruments'
  },
  {
    id: 7,
    title: 'Product 07',
    image: 'https://shreethemes.in/superex/layouts/images/items/7.jpg',
    description: 'Instruments'
  },
  {
    id: 8,
    title: 'Product 08',
    image: 'https://shreethemes.in/superex/layouts/images/items/8.jpg',
    description: 'Instruments'
  },
  {
    id: 9,
    title: 'Product 09',
    image: 'https://shreethemes.in/superex/layouts/images/items/9.jpg',
    description: 'Instruments'
  },
  {
    id: 10,
    title: 'Product 10',
    image: 'https://shreethemes.in/superex/layouts/images/items/10.jpg',
    description: 'Instruments'
  },
  {
    id: 11,
    title: 'Product 11',
    image: 'https://shreethemes.in/superex/layouts/images/items/11.jpg',
    description: 'Instruments'
  },
  {
    id: 12,
    title: 'Product 12',
    image: 'https://shreethemes.in/superex/layouts/images/items/12.jpg',
    description: 'Instruments'
  },
  {
    id: 13,
    title: 'Product 13',
    image: 'https://shreethemes.in/superex/layouts/images/items/13.jpg',
    description: 'Instruments'
  },
  {
    id: 14,
    title: 'Product 14',
    image: 'https://shreethemes.in/superex/layouts/images/items/14.jpg',
    description: 'Instruments'
  },
  {
    id: 15,
    title: 'Product 15',
    image: 'https://shreethemes.in/superex/layouts/images/items/15.jpg',
    description: 'Instruments'
  },
  {
    id: 16,
    title: 'Product 16',
    image: 'https://shreethemes.in/superex/layouts/images/items/16.jpg',
    description: 'Instruments'
  },
  {
    id: 17,
    title: 'Product 17',
    image: 'https://shreethemes.in/superex/layouts/images/items/17.jpg',
    description: 'Instruments'
  },
  {
    id: 18,
    title: 'Product 18',
    image: 'https://shreethemes.in/superex/layouts/images/items/18.jpg',
    description: 'Instruments'
  },
  {
    id: 19,
    title: 'Product 19',
    image: 'https://shreethemes.in/superex/layouts/images/items/19.jpg',
    description: 'Instruments'
  },
  {
    id: 20,
    title: 'Product 20',
    image: 'https://shreethemes.in/superex/layouts/images/items/20.jpg',
    description: 'Instruments'
  }
];
const RootStyle = styled('div')(({ theme }) => ({
  // overflow: 'hidden',
  padding: theme.spacing(18, 0),
  position: 'relative'
}));
// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object
};

function CarouselItem({ item }) {
  const { id, image } = item;

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 1,
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'center',
        height: 170,
        background: `url(${image})`,
        backgroundSize: 'cover',
        boxShadow: '0px 4px 31px rgba(0, 0, 0, 0.11)',
        position: 'relative',
        mt: 3,
        mb: 1,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': { 
          '& .overlay': { transform: 'translateY(0%)' } 
        }
      }}
    >
      <Stack
        className="overlay"
        alignItems="center"
        justifyContent="center"
        spacing={3}
        sx={{
          background: 'rgba(0, 0, 0, 0.7)',
          position: 'absolute',
          width: 1,
          height: 1,
          transform: 'translateY(-100%)',
          transition: 'transform 0.3s'
        }}
      >
          <Button
            sx={{ width: 100, borderRadius: "20px" }}
            color="primary"
            variant="contained"
            startIcon={<GavelIcon />}
            href={`/bid/${id}`}
          >
            Bid
          </Button>
      </Stack>
    </Box>
  );
}

export default function CarouselCenterMode() {
  const carouselRef = useRef();

  const settings = {
    centerPadding: '60px',
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    // autoplaySpeed: 2000,
    cssEase: "linear",
    rows: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5 }
      },
      {
        breakpoint: 960,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerPadding: '0' }
      }
    ]
  };

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {MOCK_CAROUSELS.map((item, index) => (
          <CarouselItem key={index} item={item} />
        ))}
      </Slider>
    </RootStyle>
  );
}
