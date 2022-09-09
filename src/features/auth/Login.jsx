import React, {useRef, useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {setCredentials} from './authSlice'
import {useLoginMutation} from './authApiSlice'
import { usePersist } from '../../hooks/usePersist'
import PulseLoader from 'react-spinners/PulseLoader'
import { useTitle } from '../../hooks/useTitle'

export const Login = () => {
	useTitle('Employee Login')
	
	const userRef = useRef()
	const errRef = useRef()

	const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [login, props] = useLoginMutation()
	// console.log('useLoginMutation: ',props)
	const {isLoading} = useLoginMutation

	const handleSubmit = async e => {
		e.preventDefault()

		try{
			const {accessToken} = await login({username, password}).unwrap()
			// console.log(accessToken)
			dispatch(setCredentials({accessToken}))
			setUsername('')
			setPassword('')
			navigate('/dash')
		}catch(err){
			if (!err.status) {
				setErrMsg('No Server Response');
			} else if (err.status === 400) {
					setErrMsg('Missing Username or Password');
			} else if (err.status === 401) {
					setErrMsg('Unauthorized');
			} else {
					setErrMsg(err.data?.message);
			}
			errRef.current.focus()
		}
	}

	if(isLoading)
		<PulseLoader color='#fff'/>

	useEffect(() => {
		userRef.current.focus()
	}, [])

	useEffect(() => {
		setErrMsg('')
	}, [username, password])

	return (
		<section className='public'>
			<header>
				<h1>Employee Login</h1>
			</header>

			<main className='login'>
				<p 
					ref={errRef}
					className={`${errMsg} ? 'errmsg' : 'offscreen'`}
					aria-live='assertive'
				>
					{errMsg}
				</p>

				<form
					className='form'
					onSubmit={handleSubmit}
				>
					<label htmlFor="username">Username:</label>
					<input 
						type="text"
						className='form__input'
						id='username'
						ref={userRef}
						value={username} 
						autoComplete='off'
						required
						onChange={e => setUsername(e.target.value)}
					/>

					<label htmlFor="password">Password:</label>
					<input 
						type="password"
						className='form__input'
						id='password'
						value={password} 
						onChange={e => setPassword(e.target.value)}
					/>

					<button
						type='submit'
						className='form__submit-button'
					>
						Sign In
					</button>
					<label 
						htmlFor='persist'
						className='form__persist'
					>
						<input 
							type="checkbox"
							className='form__checkbox'
							id='persist'
							checked={persist}
							onChange={() => setPersist(prev => !prev)} 
						/>
						Trust this device
					</label>
				</form>
			</main>
			<footer>
				<Link to='/'>Back to Home</Link>
			</footer>
		</section>
	)
}
