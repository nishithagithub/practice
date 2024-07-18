// import React from 'react';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
// import ExploreContainer from '../components/ExploreContainer';
// import './Home.css';

// const Home: React.FC = () => {
//   return (
//     <IonPage>
//       <IonHeader className='pgcolor'>
//         <IonToolbar>
//           <IonTitle></IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent fullscreen className='pgcolor'>
        
//         <IonHeader collapse="condense">
//           <IonToolbar>
//             <IonTitle size="large"></IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <ExploreContainer />
//       </IonContent>
//     </IonPage>
//   );
// };


import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonImg,IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonRouterLink, IonText,IonFooter } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className='pgcolor'>
        
       
        <div className="hd-button">
          
          <IonButton shape="round" color="light">Login</IonButton>
          <IonButton shape="round" color="light">SignUp</IonButton>
        </div>
      </IonHeader>
      <IonContent fullscreen className='pgcolor'>
        <IonGrid className="custom-grid">
          <IonRow className='custom-row'>
            <IonCol className="custom-col">
            <IonImg src="https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="box-image"/>
            
              <IonRouterLink className='full-link' routerLink="/add">Add</IonRouterLink>
            </IonCol>
            <IonCol className="custom-col">
            <IonImg src="https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="box-image"/>
            
              <IonRouterLink className='full-link' routerLink="/search">Search</IonRouterLink>
            </IonCol>
          </IonRow>
          <IonRow className='custom-row'>
            <IonCol className="custom-col">
            <IonImg src="https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="box-image"/>
            
              <IonRouterLink className='full-link' routerLink="/accounting">Accounting</IonRouterLink>
            </IonCol>
            <IonCol className="custom-col">
            <IonImg src="https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="box-image"/>
            
              <IonRouterLink className='full-link' routerLink="/orders">Orders</IonRouterLink>
            </IonCol>
          </IonRow>
        </IonGrid>
        

      </IonContent>
      <IonFooter className='footer'>
        <IonText>Contact Us : 9010203040</IonText>
        <IonText>Email : abc@gmail.com</IonText>
      </IonFooter>
      
      
      
        

      
    </IonPage>
  );
};

export default Home;

