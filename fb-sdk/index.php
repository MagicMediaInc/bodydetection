<?php

	session_start();

	include('../fb-sdk/autoload.php');

	// Facebook\FacebookSession::setDefaultApplication('868996659810049','05a5da4be51a4da8fc8b07fd51781427');	#Antony
	// Facebook\FacebookSession::setDefaultApplication('567849396614276','32e5d6576f99671edcca9157ae0f5877'); #Home Demo 
	Facebook\FacebookSession::setDefaultApplication('1424216834540090','ce4bd471ebc4f78d4c9082b0f86dd2ab'); #Arsenal Master
	// Facebook\FacebookSession::setDefaultApplication('1424270357868071','367a6a69a59519b55078c34b86a1bee0'); #Arsenal Test 1

	// $session = new Facebook\FacebookSession('868996659810049|05a5da4be51a4da8fc8b07fd51781427');

	// $session = Facebook\FacebookSession::newAppSession();

	// $helper = new Facebook\FacebookRedirectLoginHelper('http://programingphp.hol.es/fb-sdk/index.php?picture-name='.$_POST['picture-name']);
	$helper = new Facebook\FacebookCanvasLoginHelper();

	try {
		$session = $helper->getSession();
	} catch (Facebook\FacebookRequestException $e) {
		echo $e->getMessage();
	} catch(Exception $e){
		echo $e->getMessage();
	}

	var_dump($session);
	/*$loginUrl = $helper->getLoginUrl();

	var_dump($loginUrl);

	try {
	  $session = $helper->getSessionFromRedirect();
	} catch(Facebook\FacebookRequestException $ex) {
		echo $ex;
	  // When Facebook returns an error
	} catch(\Exception $ex) {
		echo $ex;
	  // When validation fails or other local issues
	}*/
	/*var_dump($helper->getSessionFromRedirect());
	var_dump($session);*/
	if ($session) {
	  // Logged in
		// var_dump($session);
		$image = $_GET['picture-name'];

		  try {

		  	$user_profile = (new Facebook\FacebookRequest(
		      $session, 'GET', '/me'
		    ))->execute()->getGraphObject(Facebook\GraphUser::className());

		    echo "Name: " . $user_profile->getName();

		    // Upload to a user's profile. The photo will be in the
		    // first album in the profile. You can also upload to
		    // a specific album by using /ALBUM_ID as the path     
		    /*$response = (new Facebook\FacebookRequest(
		      $session, 'POST', '/me/photos', array(
		        'source' => new CURLFile('path/to/file.name', 'image/png'),
		        'message' => 'User provided message'
		      )
		    ))->execute()->getGraphObject();*/

		    // If you're not using PHP 5.5 or later, change the file reference to:
		    // 'source' => '@/path/to/file.name'

		    echo "Posted with id: " . $response->getProperty('id');

		  } catch(Facebook\FacebookRequestException $e) {

		    echo "Exception occured, code: " . $e->getCode();
		    echo " with message: " . $e->getMessage();

		  }   

	}
	else{
		$helper = new Facebook\FacebookRedirectLoginHelper('http://programingphp.hol.es/fb-sdk/index.php?picture-name='.(isset($_POST['picture-name']) ? $_POST['picture-name'] : $_GET['picture-name'] ));
		$oauth_url = $helper->getLoginUrl(array('email', 'publish_actions'));
		echo "<script>window.top.location.href='".$oauth_url."'</script>";
	}

	// var_dump($session);

	