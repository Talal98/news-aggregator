import { categoryToGuardian, guardianToCategory } from "../utils/constants";
import { guardianApi, newsApi } from "./api";

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