import { useState, useEffect } from 'react';
import { Alert, Box, Button, Checkbox, Container, FormControlLabel, Snackbar, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authors, categories, sources } from '../../utils/constants';

const Settings = () => {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedSources, setSelectedSources] = useState<string[]>([]);
	const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		// Load preferences from localStorage if they exist
		const savedCategories = localStorage.getItem('preferredCategories');
		const savedSources = localStorage.getItem('preferredSources');
		const savedAuthors = localStorage.getItem('preferredAuthors');
		if (savedCategories) setSelectedCategories(JSON.parse(savedCategories));
		if (savedSources) setSelectedSources(JSON.parse(savedSources));
		if (savedAuthors) setSelectedAuthors(JSON.parse(savedAuthors));
	}, []);

	const handleSavePreferences = () => {
		localStorage.setItem('preferredCategories', JSON.stringify(selectedCategories));
		localStorage.setItem('preferredSources', JSON.stringify(selectedSources));
		localStorage.setItem('preferredAuthors', JSON.stringify(selectedAuthors));
		setOpen(true);
	};

	const toggleSelection = (list: string[], setList: (value: string[]) => void, value: string) => {
		if (list.includes(value)) {
			setList(list.filter((item) => item !== value));
		} else {
			setList([...list, value]);
		}
	};

	return (
		<Container>
			<Box my={4}>
				<Box display="flex" justifyContent="space-between" alignItems={'center'}>
					<Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>User Preferences</Typography>
					<Button sx={{ color: 'black' }}>
						<Home onClick={() => navigate('/')} />
					</Button>
				</Box>

				{/* Category Preferences */}
				<Typography variant="h6" mt={2}>Preferred Categories</Typography>
				{categories.map((category) => (
					<FormControlLabel
						key={category}
						control={
							<Checkbox
								checked={selectedCategories.includes(category)}
								onChange={() => toggleSelection(selectedCategories, setSelectedCategories, category)}
							/>
						}
						label={category}
					/>
				))}

				{/* Source Preferences */}
				<Typography variant="h6" mt={2}>Preferred Sources</Typography>
				{sources.map((source) => (
					<FormControlLabel
						key={source}
						control={
							<Checkbox
								checked={selectedSources.includes(source)}
								onChange={() => toggleSelection(selectedSources, setSelectedSources, source)}
							/>
						}
						label={source}
					/>
				))}

				{/* Author Preferences */}
				<Typography variant="h6" mt={2}>Preferred Authors</Typography>
				{authors.map((author) => (
					<FormControlLabel
						key={author}
						control={
							<Checkbox
								checked={selectedAuthors.includes(author)}
								onChange={() => toggleSelection(selectedAuthors, setSelectedAuthors, author)}
							/>
						}
						label={author}
					/>
				))}

			</Box>
			{/* Save Button */}
			<Button variant="contained" onClick={handleSavePreferences}>
				Save Preferences
			</Button>
			<Snackbar
				open={open}
				autoHideDuration={2000}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					severity="success"
					variant="filled"
					sx={{ width: '100%' }}
				>
					Preferences saved successfully!
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default Settings;
