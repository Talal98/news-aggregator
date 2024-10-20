import { categoryToGuardian, guardianToCategory } from "../utils/constants";
import { guardianApi, newYorkTimesApi, newsApi } from "./api";

export const fetchNewsApiArticles = async (
	query: string,
	category: any,
	sources: any,
) => {
	let results: any = []

	if (category && category.length > 0) {
		if (category.length > 1) {
			for (let i = 0; i < category.length; i++) {
				const response = await newsApi({
					q: query,
					category: category[i],
				});
				const responseWithCategory = response.map((article: any) => {
					return {
						...article,
						category: category[i],
					}
				})
				results = results.concat(responseWithCategory)
			}
		}
		else {
			const response = await newsApi({
				q: query,
				category: category[0],
			});
			const responseWithCategory = response.map((article: any) => {
				return {
					...article,
					category: category[0],
				}
			})
			results = results.concat(responseWithCategory);
		}
	}

	if (sources && sources.length > 0) {
		const sourcesString = sources.join(',');
		const response = await newsApi({
			q: query,
			sources: sourcesString,
		});
		results = results.concat(response);
	}

	if (results.length === 0 && query) {
		const response = await newsApi({
			q: query,
		});
		results = response;
	}

	return results;
}

export const fetchGuardianArticles = async (
	query: string,
	category: any,
) => {
	let results: any = []

	if (category && category.length > 0) {
		if (category.length > 1) {
			const updatedCategory = category.map((cat: any) => {
				return categoryToGuardian[cat]
			});
			const sectionString = updatedCategory.join('|');
			const response = await guardianApi({
				q: query,
				section: sectionString,
			});
			results = response
		} else {
			const response = await guardianApi({
				q: query,
				section: categoryToGuardian[category[0]],
			});
			results = response
		}
	}

	if (results.length === 0) {
		const response = await guardianApi({
			q: query,
		});
		results = response;
	}

	const mappedResults = results.map((article: any) => {
		return {
			title: article?.webTitle,
			description: article?.fields?.trailText,
			urlToImage: article?.fields?.thumbnail,
			publishedAt: article?.webPublicationDate,
			url: article?.webUrl,
			source: {
				name: 'Guardian',
			},
			category: guardianToCategory[article.sectionId],
		}
	});

	return mappedResults;
}

export const fetchNewYorkTimesArticles = async (
	query: string,
	category: any,
) => {
	let results: any = []

	if (category && category.length > 0) {
		if (category.length > 1) {
			const updatedCategory = category.map((cat: any) => {
				if (cat === 'Entertainment') {
					return 'culture'
				} else {
					return cat.toLowerCase()
				}
			});
			const sectionString = updatedCategory.join('", "');
			for (let i = 0; i < 2; i++) {
				const response = await newYorkTimesApi({
					q: query,
					fq: `news_desk:("${sectionString}")`,
					page: i,
				});
				results = results.concat(response)
			}
		} else {
			const updatedCategory = category[0] === 'Entertainment' ? 'culture' : category[0].toLowerCase();
			for (let i = 0; i < 2; i++) {
				const response = await newYorkTimesApi({
					q: query,
					fq: `news_desk:("${updatedCategory}")`,
					page: i,
				});
				results = results.concat(response)
			}
		}
	}

	if (results.length === 0) {
		for (let i = 0; i < 2; i++) {
			const response = await newYorkTimesApi({
				q: query,
				page: i,
			});
			results = results.concat(response);
		}
	}

	const mappedResults = results.map((article: any) => {
		return {
			title: article?.headline?.main,
			description: article?.abstract,
			urlToImage: article?.multimedia?.length > 0 ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
			publishedAt: article?.pub_date,
			url: article?.web_url,
			source: {
				name: 'The New York Times',
			},
			category: article?.news_desk === 'Culture' ? 'Entertainment' : article?.news_desk,
		}
	});

	return mappedResults;
}