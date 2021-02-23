import React, { useState, useEffect } from "react";
import axios from "axios";

import NotFound from "./NotFound";
import PageLoader from "./PageLoader";
import Post from "./Post";
import mapboxgl from "mapbox-gl";

import { useParams } from "react-router-dom";

const NearbyPosts = (props) => {
	const { center } = useParams();

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [locationName, setLocationName] = useState("");

	let [lng, lat] = center.split(",");

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const url = `/api/v1/posts/near?lat=${lat}&lng=${lng}`;
			const res = await axios.get(url);
			setPosts(res.data.data.posts);
			setLocationName(res.data.data.location.name);
			setLoading(false);
		} catch (e) {
			setPosts([]);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();

		// MapBox Token
		mapboxgl.accessToken =
			"pk.eyJ1Ijoic21hbmFuMyIsImEiOiJja2FqcHNqZmMwY3k0MnRtbmUyaTA3c3k0In0.7AdKPQUF4xS4_WlTI1eO6Q";

		// Render map on screen
		var map = new mapboxgl.Map({
			container: "map-container",
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng * 1, lat * 1],
			zoom: 13,
		});

		// Location markers JSON File
		const geojson = {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [lng * 1, lat * 1],
					},
					properties: {
						title: "Mapbox",
						description: locationName,
					},
				},
			],
		};

		geojson.features.forEach(function (marker) {
			// create a HTML element for each feature
			var el = document.createElement("div");
			el.className = "marker";

			// make a marker for each feature and add to the map
			new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
		});
	}, []);

	return (
		<div className="my-timeline">
			<div className="nearby-posts__heading" id="map-container"></div>
			{!loading ? (
				<>
					<div className="location-name">
						<p>{locationName}</p>
					</div>
					{!!posts.length ? (
						posts.map((post, index) => <Post post={post} key={post._id} isNearby={true} />)
					) : (
						<div className="no-posts">
							<NotFound message={"Nothing Here."} />
						</div>
					)}
				</>
			) : (
				<PageLoader />
			)}
		</div>
	);
};

export default NearbyPosts;
