import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const PageTitle = ({
	title,
	subTitle,
	subTitleRoute,
	description,
}: {
	title: string;
	subTitle?: string;
	subTitleRoute?: string;
	description?: string;
}) => {

	useEffect(() => {
		document.title = title ? `${title} - HRNet` : 'HRNet';
		// SEO optimization: Set the document title
		const metaTitle = document.querySelector('meta[name="title"]');
		if (metaTitle) {
			metaTitle.setAttribute('content', title || 'HRNet');
		}
		// SEO optimization: Set the document description
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				description || `Explore ${title} on HRNet. Manage your employees efficiently.`
			);
		}

		// SEO optimization: Set the Open Graph title
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle) {
			ogTitle.setAttribute('content', title || 'HRNet');
		}

		// SEO optimization: Set the Open Graph description
		const ogDescription = document.querySelector('meta[property="og:description"]');
		if (ogDescription) {
			ogDescription.setAttribute(
				'content',
				description || `Explore ${title} on HRNet. Manage your employees efficiently.`
			);
		}
		// SEO optimization: Set the Twitter title
		const twitterTitle = document.querySelector('meta[name="twitter:title"]');
		if (twitterTitle) {
			twitterTitle.setAttribute('content', title || 'HRNet');
		}
		// SEO optimization: Set the Twitter description
		const twitterDescription = document.querySelector('meta[name="twitter:description"]');
		if (twitterDescription) {
			twitterDescription.setAttribute(
				'content',
				description || `Explore ${title} on HRNet. Manage your employees efficiently.`
			);
		}
	}, [title, description]);


	return (
		<>
			<div className="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
				<div className="flex-grow-1">
					<h4 className="fs-18 fw-semibold mb-0">{title}</h4>
				</div>
				<div className="text-end">
					<ol className="breadcrumb m-0 py-0">
						<li className="breadcrumb-item">
							<RouterLink to="/">HRNet</RouterLink>
						</li>
						<li className="mx-1 flex-centered">
							<i className="bi bi-chevron-right"></i>
						</li>
						{subTitle && (
							<>
								<li className="breadcrumb-item">
									<RouterLink to={subTitleRoute || ""}>{subTitle}</RouterLink>
								</li>
								<li className="mx-1 flex-centered">
									<i className="bi bi-chevron-right"></i>
								</li>
							</>
						)}

						<li className="breadcrumb-item active">{title}</li>
					</ol>
				</div>
			</div>
		</>
	);
};

export default PageTitle;
