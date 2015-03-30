<?php

	$image = base64_decode($_REQUEST['imageData']);

	file_put_contents('../uploads/'.$_REQUEST['imageName'], $image);

	