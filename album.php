<?php  

$ruta = './uploads/';

$dir = opendir($ruta);

while($file=readdir($dir)){
    if(!is_dir($file)){
        $data[] = array($file, date("Y-m-d H:i:s",filemtime($ruta.'/'.$file)));
        $files[] = $file;
        $dates[] = date("Y-m-d H:i:s",filemtime($ruta.'/'.$file));
    }
}

closedir($dir);

array_multisort($dates, SORT_DESC, $data);


?> 
<div class="container">

<?php 
sort($files); 
foreach ($data as $archivo) {  
echo '<a href="'.$ruta.$archivo[0].'"><img class="album" src="'.$ruta.$archivo[0].'" /></a>'; } 
?> 
</div>
		<style type="text/css">
			body{
				padding:0px;
				margin:0px;
			}
			.container{
				padding-top:120px;
				text-align: center;
			}
			.album{
				width: 20%;
				display: inline-block;
				margin: 10px 10px;
			}
		</style>
        <div style="position:fixed;top:0px; right:0px; height:72px; width:100%;text-align:center;background-color:rgba(37,37,37,0.3)"> 
        <div style="width:90%; display:block; position:absolute; left:5%;top:10px;">
        <div style="float:left;"> 
            <a href="javascript:history.back()" onMouseOver="swapImage('atras','smileatras')" 
            onMouseOut="swapImage('atras','nosmileatras')"> 
            <img src="./images/x-minus.png" width="50px;">
            </a> 
        </div>
        <div style="margin-top: 10px;">  
            <a href="http://mirror.arsenalindustries.com.ve" > 
            <img src="./img/logo-4.png"  
            border="0" 
            name="menu" alt="Menu"></a> 
        </div>
        </div>
        </div>  
         
    <a href="#" class="scrolltop"></a> 
     
    </body> 
</html>