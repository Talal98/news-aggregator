import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, TextField, MenuItem, Button, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import moment, { Moment } from 'moment';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import { fetchGuardianArticles, fetchNewsApiArticles } from '../../services/service';
import { categories, sources } from '../../utils/constants';

const Home = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const [articles, setArticles] = useState<any>([]);
	const [category, setCategory] = useState<string | null>(null);
	const [source, setSource] = useState<string | null>(null);
	const [fromDate, setFromDate] = useState<Moment | null>(null);
	const [toDate, setToDate] = useState<Moment | null>(null);
	const [filteredArticles, setFilteredArticles] = useState<any>([]);

	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 500); // 500ms debounce delay

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);

	useEffect(() => {
		const preferredCategories = localStorage.getItem('preferredCategories');
		const preferredSources = localStorage.getItem('preferredSources');
		const preferredAuthors = localStorage.getItem('preferredAuthors');

		const loadArticles = async () => {
			try {
				setLoading(true);
				const [guardianArticles, fetchedArticles] = await Promise.all([
					fetchGuardianArticles(debouncedSearchTerm, preferredCategories ? JSON.parse(preferredCategories) : null),
					fetchNewsApiArticles(
						debouncedSearchTerm,
						preferredCategories ?
							JSON.parse(preferredCategories).length > 0 ? JSON.parse(preferredCategories) : categories
							:
							categories,
						preferredSources ? JSON.parse(preferredSources) : null,
					),
				]);
				
				setArticles([...guardianArticles, ...fetchedArticles]);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching articles', error);
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};

		loadArticles();
	}, [debouncedSearchTerm]);

	useEffect(() => {
		if (fromDate || toDate || category || source) {
			let filtered: any[] = [];
			if (category) {
				const filterationArticles = filtered.length > 0 ? filtered : articles;
				filtered = filterationArticles.filter((article: any) => article?.category?.toString().toLowerCase() === category.toLowerCase());
			}
			if (source) {
				const filterationArticles = filtered.length > 0 ? filtered : articles;
				filtered = filterationArticles.filter((article: any) => article?.source?.name?.toString().toLowerCase() === source.toLowerCase());
			}
			if (fromDate) {
				const filterationArticles = filtered.length > 0 ? filtered : articles;
				filtered = filterationArticles.filter((article: any) => moment(article?.publishedAt).isAfter(fromDate));
			}
			if (toDate) {
				const filterationArticles = filtered.length > 0 ? filtered : articles;
				filtered = filterationArticles.filter((article: any) => moment(article?.publishedAt).isBefore(toDate));
			}
			setFilteredArticles(filtered);
		} else {
			setFilteredArticles([]);
		}
	}, [category, source, fromDate, toDate]);

	const finalArticles = (category || source || fromDate || toDate) ? filteredArticles : articles;

	return (
		<Container>
			<Box my={4}>
				<Box display="flex" justifyContent="space-between" alignItems={'center'} sx={{ marginBottom: 2 }}>
					<Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>News Aggregator</Typography>
					<Button sx={{ color: 'black' }}>
						<SettingsIcon onClick={() => navigate('/settings')} />
					</Button>
				</Box>

				{/* Search Input */}
				<TextField
					fullWidth
					label="Search for news..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{ mb: 2 }}
				/>

				{/* Filters */}
				<Box display="flex" justifyContent="space-between" sx={{ mb: 2 }} flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}>
					<TextField
						select
						label="Category"
						value={category || ''}
						onChange={(e) => setCategory(e.target.value || null)}
						sx={{ width: { xs: '100%', sm: '25%' }, mb: { xs: 2, sm: 0 } }}
					>
						<MenuItem value="">All</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat} value={cat.toLowerCase()}>
								{cat}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Source"
						value={source || ''}
						onChange={(e) => setSource(e.target.value || null)}
						sx={{ width: { xs: '100%', sm: '25%' }, mb: { xs: 2, sm: 0 } }}
					>
						<MenuItem value="">All</MenuItem>
						{sources.map((src) => (
							<MenuItem key={src} value={src}>
								{src}
							</MenuItem>
						))}
					</TextField>

					<DatePicker
						label="From"
						value={fromDate}
						onChange={(date) => setFromDate(date)}
						sx={{ mb: { xs: 2, sm: 0 } }}
						slotProps={{ field: { clearable: true } }}
					/>

					<DatePicker
						label="To"
						value={toDate}
						onChange={(date) => setToDate(date)}
						slotProps={{ field: { clearable: true } }}
					/>
				</Box>


				{loading &&
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 15 }}>
						<CircularProgress />
					</Box>
				}

				{
					!loading && finalArticles?.length === 0 &&
					<Typography variant="h6">No articles found</Typography>
				}

				{!loading && finalArticles?.length !== 0 &&
					<Grid container spacing={3}>
						{finalArticles?.map((article: any, idx: number) => {
							if (article.title !== '[Removed]') {
								return <Grid item xs={12} sm={6} md={4} key={idx}>
									<ArticleCard
										title={article.title}
										description={article.description}
										urlToImage={article.urlToImage}
										publishedAt={article.publishedAt}
										articleUrl={article.url}
									/>
								</Grid>
							}
						}
						)}
					</Grid>
				}
			</Box>
		</Container>
	);
};

export default Home;
