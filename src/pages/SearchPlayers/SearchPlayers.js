import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import Header from '../../components/Header/Header';
import axios from "axios";
import SearchBar from '../../components/SearchBar/SearchBar';
import Attributes from '../../components/Attributes/Attributes';
import SelectForm from '../../components/SelectForm/SelectForm';
import './SearchPlayers.styles.scss';
import {basicApiUrl, autocompleteApiUrl, fuzzyApiUrl, wildcardApiUrl} from '../../ApiRoutes';

const listValues = ['Basic', 'Autocomplete', 'Fuzzy Matching', 'Wildcard'];

const SearchPlayers = ({history}) => {
  const [playerName, setPlayerName] = useState('');
  const [urlString, setUrlString] = useState(basicApiUrl);

  const playerCallback = async(value, query) => {
    setPlayerName(value);
    if(query){
      const players = await axios.get(`${urlString}?arg=${playerName}`).then((req)=>req.data);
      console.log(players);
      history.push({
        pathname:'/players-retrieved',
        state: { players, }
      })
    }
  }



  const attributeCallback = async(object) => {
    const natin=object.countrySelected;
    const foot=object.prefferedBoot;
    const club=object.clubSelected;
    const pos = object.positionSelected;
    const lowend = object.minOverall;
    const highend = object.maxOverall;
    const players = await axios.get(`${urlString}?arg=${playerName}&natin=${natin}&club=${club}&foot=${foot}&pos=${pos}&lowEnd=${lowend}&highEnd=${highend}`).then((req)=>req.data);
    console.log(`${urlString}?arg=${playerName}&natin=${natin}&club=${club}&foot=${foot}&pos=${pos}&lowEnd=${lowend}&highEnd=${highend}`);
    
    console.log(object.minDribbling, object.maxDribbling, object.minDefending, object.maxDefending, object.minPace, object.maxPace
      , object.minShooting, object.maxShooting, object.minPhysicality, object.maxPhysicality, object.minPassing, object.maxPassing);
    const filtered = players.filter(player => {
      if(object.minPace <= player.Speed.$numberInt && object.maxPace >= player.Speed.$numberInt
        && object.minDribbling <= player.Dribbling.$numberInt && object.maxDribbling >= player.Dribbling.$numberInt
        && object.minPassing <= player.Passing.$numberInt && object.maxPassing >= player.Passing.$numberInt
        && object.minPhysicality <= player.Strength.$numberInt && object.maxPhysicality >= player.Strength.$numberInt
        && object.minShooting <= player.Finishing.$numberInt && object.maxShooting >= player.Finishing.$numberInt
        && object.minDefending <= player.Defending.$numberInt && object.maxDefending*3 >= player.Defending.$numberInt
        && object.starsSelected*80 <= Number(player.Skill.$numberInt)){
        return true;
      }
    })
    history.push({
      pathname:'/players-retrieved',
      state: { players:filtered }
    })
  }

  const urlCallback = (urlValue) =>{
    switch(urlValue){
      case 'Basic':
        return setUrlString(basicApiUrl);
      case 'Autocomplete':
        return setUrlString(autocompleteApiUrl);
      case 'Fuzzy Matching':
        return setUrlString(fuzzyApiUrl);
      case 'Wildcard':
        return setUrlString(wildcardApiUrl);
      default:
        return setUrlString(basicApiUrl);
    }
  }


  return(
    <div className='sp-wrapper'>
      <Header />
      <div className='sp-sb'>
        <SearchBar callback={playerCallback} color={'blue'}/>
        <div className='sp-select-form'>
          <SelectForm listTitle={'Select API URL'} values={listValues} callbackfn={urlCallback}/>
        </div>
      </div>
      <Attributes callback={attributeCallback}/>
    </div>
  );
};
export default withRouter(SearchPlayers);