// GeoCodes the location via mapbox API for location in posts
import axios from "axios";

const geoCode = async (keyword) => {
	try {
		const apiLimit = 5;
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
			keyword
		)}.json?access_token=pk.eyJ1Ijoic21hbmFuMyIsImEiOiJja2QycnZ4ZzExZzBoMnVwNHIwd2MxNm9xIn0.2ciILybPF6jxSZpP6D6Kcw&limit=${apiLimit}`;

		const res = await axios.get(url);
		const locationData = [];

		res.data.features.forEach((location) => {
			const newLocationObject = {
				name: location.place_name,
				longitude: location.center[0],
				latitude: location.center[1],
			};

			locationData.push(newLocationObject);
		});

		return locationData;
	} catch (e) {
		return [];
	}
};

export default geoCode;
