import { newsApi } from "./api";

export const fetchNewsApiArticles = async (
	query: string,
	category: any,
	sources: any,
) => {
	let results: any = []

	if (category && category.length > 0) {
		if (category.length > 1) {
			category.map(async (cat: any) => {
				const response = await newsApi({
					q: query,
					category: cat,
				});
				const responseWithCategory = response.map((article: any) => {
					return {
						...article,
						category: cat,
					}
				})
				results = results.concat(responseWithCategory);
			});
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