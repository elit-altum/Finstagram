import React, { useState } from 'react';
import axios from 'axios';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { FcSearch as SearchIcon } from 'react-icons/fc';
import { FaRegSadTear as SadIcon } from 'react-icons/fa';
import { TiLocation as PinIcon } from 'react-icons/ti';

import { Link } from "react-router-dom";

import { UserInfoSmall } from './likesArray';
import geoCode from '../utils/geoCode';

// Display location search results
const LocationResults = ({ locations }) => {
    // Search result component
    return (
        <div className='search-location-results'>
            {locations.map((location) => (
                <div
                    className='location-data'
                    key={location.name}
                >	
					<PinIcon />
					<Link
						to={`/post/nearby/${location.longitude},${location.latitude}`}
					>
						<p>{location.name}</p>
					</Link>
                </div>
            ))}
        </div>
    );
};

const SearchUsers = () => {
    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');

    const matchQueryAsync = async (value) => {
		if(!value) {
			setLocations([]);
			return;
		}
        try {
            const url = '/api/v1/users/search';
            const res = await axios({
                url,
                method: 'POST',
                data: {
                    search: value,
                },
            });
            setUsers(res.data.data.users);

            const geoCodeRes = await geoCode(value);
            !value ? setLocations([]) : setLocations(geoCodeRes);

            setLoading(false);
        } catch (err) {
            console.log(err);
            if (err.hasOwnProperty('response') && err.response.status === 400) {
                setUsers(['1']);
            } else {
                setUsers([]);
            }
            setLoading(false);
        }
    };

    const matchQueryAsyncDebounced = AwesomeDebouncePromise(
        matchQueryAsync,
        800
    );

    const handleTextChange = async (e) => {
        e.preventDefault();

        setLoading(true);
        setUsers(['1']);
        setText(e.target.value);
        setLocations([]);

        await matchQueryAsyncDebounced(e.target.value);
    };

    return (
        <div className='searchUsers'>
            <h3>Search Users & Places</h3>
            <div className='searchUser-bar'>
                <div className='searchUser-bar__icon'>
                    <SearchIcon />
                </div>
                <input
                    name='search'
                    onChange={handleTextChange}
                    autoComplete='off'
                    className='searchUser-bar__input'
                    placeholder='Search Users or Places'
                />
            </div>
            <div className='searchUsers-results'>
                {!!text &&
                    (!!users.length ? (
                        !loading ? (
                            users.map((user) => (
                                <UserInfoSmall user={user} key={user._id} />
                            ))
                        ) : (
                            <div className='search-loader'></div>
                        )
                    ) : (
                        locations.length == 0 && (
                            <div className='search-not-found'>
                                <SadIcon />
                                <p>No users found.</p>
                            </div>
                        )
                    ))}
                {!loading && locations.length > 0 && (
                    <LocationResults locations={locations} />
                )}
            </div>
        </div>
    );
};

export default SearchUsers;
