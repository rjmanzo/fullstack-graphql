import React, {useEffect, useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const PETS_FIELDS = gql`
  fragment PetFields on Pet {
    id
    name
    type
    img
    owner {
      id
      age @client
    }
    vaccinated @client
  }
`;  

const GET_PETS = gql`
  query GetPets {
    pets {
      ...PetFields
    }
  }
  ${PETS_FIELDS}
`;

console.log('GET_PETS', GET_PETS);

const CREATE_PET = gql`
  mutation CreatePet($newPet: newPetInput!) {
    newPet(input: $newPet) {
      ...PetFields
    }
  }
  ${PETS_FIELDS}
`;


export default function Pets () {
  const [modal, setModal] = useState(false)
  const { loading, error, data } = useQuery(GET_PETS);
  const [createPet, newPet] = useMutation(
    CREATE_PET, {
      update(cache, {data: {newPet}}) {
        const data = cache.readQuery({ query: GET_PETS});
        const laData = [newPet, ...data.pets];
        console.log('es laData', laData);
        cache.writeQuery({
          query: GET_PETS,
          data: {pets: [newPet, ...data.pets]}
        })
      }
    }
    );

  const onSubmit = input => {
    setModal(false)
    createPet({
      variables: {
        newPet: input,
      },
      optimisticResponse:{
        __typename: 'Mutation',
        newPet: {
          __typename: 'Pet',
          id: Math.floor(Math.random() * 1000),
          name: input.name,
          type: input.type,
          img: 'http://via.placeholder.com/300',
          vaccinated: true
        }
      }
    });
  }

  if (loading) return <Loader />;
  if (error || newPet.error) return `Error! ${error.message}`;
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  )
}
