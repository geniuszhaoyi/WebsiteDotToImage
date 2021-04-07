import classes from './style.module.scss';

function Footer({ children = undefined }) {
  if (children) {
    return (<div className={classes.footer}>
      {children}
    </div>)
  } else {
    return <></>
  }
}

export default Footer
