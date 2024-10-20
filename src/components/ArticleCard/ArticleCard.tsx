import React from 'react';
import { Card, CardContent, Typography, CardMedia, styled, Box, CardActionArea } from '@mui/material';
import moment from 'moment';

type ArticleCardProps = {
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  articleUrl: string;
};

const Title = styled('div')(({ theme }) => ({
  ...theme.typography.h5,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 5,
}));

const Description = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 4,
}));

const ArticleCard: React.FC<ArticleCardProps> = ({ title, description, urlToImage, publishedAt, articleUrl }) => {
  return (
    <Card>
      <CardActionArea onClick={() => window.open(articleUrl, '_blank')}>
        <CardMedia component="img" image={urlToImage} alt={title} sx={{ height: 175 }} />
        <CardContent sx={{ height: 275, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Box>
          <Typography variant="caption">{moment(publishedAt).format('DD-MMM-YYYY')}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
