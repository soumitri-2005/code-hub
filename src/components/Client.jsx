import Avatar from 'react-avatar'

const Client = ({username}) => {
  return (
    <>
    <div className="client">
        <span className='user-name'>
            <Avatar name={username} size={45} round="18px"/>
            {username}
        </span>
    </div>
    </>
  )
}

export default Client
