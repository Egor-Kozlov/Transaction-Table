import gitHubLogo from '../../img/icons/GitHub-Mark-Light-32px.png'

const Footer = () => {

    return (
     <footer className='footer'>
         <div className="wrap">
             <a className = 'github-link-container' href="https://github.com/Egor-Kozlov">
             <div className="github">
                <img className = 'github__logo' src={gitHubLogo} alt="gitHubLogo" />
                <p>Visit my GitHub</p>
             </div>
             </a>
             <p className='copyright'>© 2021</p>
         </div>
     </footer>
    )
}

export default Footer