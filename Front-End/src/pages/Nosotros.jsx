import { useState } from 'react';
import FirstSection from '../components/layouts/Nosotros/FirstSection';
import Footer from '../components/layouts/footer/Footer';
import Header from '../components/layouts/header/Header';
import SecondSection from '../components/layouts/Nosotros/SecondSection';
import ThirdSection from '../components/layouts/Nosotros/ThirdSection';

const Nosotros = () =>{

return(
    <>
        <Header/>
        <FirstSection/>
        <SecondSection/>
        <ThirdSection/>
        <Footer/>
    </>

);

} 

export default Nosotros;

