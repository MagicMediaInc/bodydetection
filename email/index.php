<?php 

	ob_start();

	$html = ob_get_contents();

	$conn = false; //mysqli_connect('localhost','root','', 'arsenal');
	// $conn = mysqli_connect('SERVER','USER','PASSWORD', 'DATABASE');
	if($conn):
		if(isset($_POST['email'])):
			$data = $_POST;
			$conn->query("INSERT INTO `arsenal`.`email` (`id`, `email`) VALUES (NULL, '".$data['email']."');")	;
			#echo true;
		else:
			echo false;
		endif;
	else:
		//die('No se pudo conectar : ' . mysql_error());
	endif;

	include('../mailer/PHPMailerAutoload.php');

	$mail = new PHPMailer();

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'smtp.mailgun.org';                 // Specify main and backup server
	$mail->SMTPAuth = true;                               // Enable SMTP authentication

	$mail->Username = 'postmaster@sandboxe2d1ffe3c2fa43e19d2c808826056072.mailgun.org';                 // SMTP username
	$mail->Password = 'arsenalindustries';                           // SMTP password
	$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 587;
	//$mail->SMTPDebug  = 1;                                    // TCP port to connect to

	$mail->setFrom ('arsenalindustries@arsenalindustries.com.ve',"Arsenal Industries International");
	// $mail->FromName = 'Arsenal Industries';
	$mail->addAddress($_POST['email']);     // Add a recipient
	$mail->addReplyTo('arsenalindustries@arsenalindustries.com.ve', 'Arsenal Industries International');
	// $mail->addAddress('ellen@example.com');               // Name is optional
	// $mail->addReplyTo('info@example.com', 'Information');
	// $mail->addCC('cc@example.com');
	// $mail->addBCC('bcc@example.com');

	// $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	

// 	$mail->IsHTML(true);                                  // Set email format to HTML

// $mail->Subject = 'Here is the subject';
// $mail->Body    = 'This is the HTML message body <strong>in bold!</strong>';
// $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

// if(!$mail->Send()) {
//    echo 'Message could not be sent.';
//    echo 'Mailer Error: ' . $mail->ErrorInfo;
//    exit;
// }

// echo 'Message has been sent';


	$mail->addAttachment('../uploads/'.$_POST['picture-name'], 'Mi-Chaleco.jpg');    // Optional name
	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = 'Mi chaleco en Arsenal Industries';
	$mail->Body    = " El chaleco antibalas debe ser una prenda que brinde un mínimo de protección acorde a las amenazas que se enfrenten en el ámbito cotidiano donde se emplee: El nivel de protección balística debe superar el calibre del arma que porta el usuario, de esta forma, se está protegido ante un eventual ataque con ella. Un chaleco debe Ofrecer Garantía por escrito por parte del Fabricante";

	if(!$mail->send()) {
	    echo 'Tu foto no ha sido enviada, intente nuevamente';
	    // return false;
	} else {
	    // return true;
	    echo 'Tu foto ha sido enviada!';
	}

