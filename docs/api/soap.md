## Introduction

<p>The Magento SOAP v1 API provides you with the ability to manage your eCommerce stores by providing calls for working with resources such as customers, categories, products, and sales orders. It also allows you to manage shopping carts and inventory.</p>

<p>A SOAP v2 API version has been available since Magento 1.3, and a WS-I compliant version has been available since Magento 1.6.</p>

## Supported Types

<p>The Magento API supports <a href="http://en.wikipedia.org/wiki/SOAP">SOAP</a> and <a href="http://en.wikipedia.org/wiki/XML_RPC">XML-RPC</a>, where SOAP is the default protocol.</p>

### SOAP

<p>To connect to Magento SOAP web services, load the <a href="http://en.wikipedia.org/wiki/WSDL">WSDL</a> into your SOAP client from either of these URLs:</p>

```http://magentohost/api/?wsdl```

```http://magentohost/api/soap/?wsdl```

<p>where magentohost is the domain for your Magento host.</p>

<p>As of v1.3, you may also use the following URL to access the Magento API v2, which has been added to improve compatibility with Java and .NET:</p>

```http://magentohost/api/v2_soap?wsdl=1```

<p>The following PHP example shows how to make SOAP calls to the Magento API v1:</p>

``` php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');

$session = $client-&gt;login('apiUser', 'apiKey');

$result = $client-&gt;call($session, 'somestuff.method');
$result = $client-&gt;call($session, 'somestuff.method', 'arg1');
$result = $client-&gt;call($session, 'somestuff.method', array('arg1', 'arg2', 'arg3'));
$result = $client-&gt;multiCall($session, [
    array('somestuff.method'),
    array('somestuff.method', 'arg1'),
    array('somestuff.method', array('arg1', 'arg2'))
)];

$client-&gt;endSession($session);</pre>
```

### XML-RPC

<p>To use XML-RPC, load the following URL into your XML-RPC client:</p>

```http://magentohost/api/xmlrpc/```

<p>where magentohost is the domain for your Magento host.</p>

<p>The following PHP example shows how to make XML-RPC calls:</p>

```php
$client = new Zend_XmlRpc_Client('http://magentohost/api/xmlrpc/');

$session = $client-&gt;call('login', array('apiUser', 'apiKey'));

$client-&gt;call('call', array($session, 'somestuff.method', array('arg1', 'arg2', 'arg3')));
$client-&gt;call('call', array($session, 'somestuff.method', array('arg1')));
$client-&gt;call('call', array($session, 'somestuff.method'));
$client-&gt;call('multiCall', array($session,
array(
array('somestuff.method', 'arg1'),
array('somestuff.method', array('arg1', 'arg2')),
array('somestuff.method')
)
));

// If you don't need the session anymore
$client-&gt;call('endSession', array($session));</pre>
```

<p>The XML-RPC only supports the version 1 of the Magento API.</p>

## API Methods

<p>The following table contains the API methods that can be called from your SOAP or XML-RPC client on the Magento v1 API.</p>



<table><tbody>
<tr>
<th> Method </th>
<th> Description </th>
<th> Return Value </th>
</tr>
<tr>
<td> startSession() </td>
<td> Start the API session and return session ID. </td>
<td> string </td>
</tr>
<tr>
<td> endSession(sessionId) </td>
<td> End the API session. </td>
<td> boolean </td>
</tr>
<tr>
<td> login(apiUser, apiKey) </td>
<td> Start the API session, return the session ID, and authorize the API user. </td>
<td> string </td>
</tr>
<tr>
<td> call(sessionId, resourcePath,array arguments) </td>
<td> Call the API resource that is allowed in the current session. See Note below. </td>
<td> mixed </td>
</tr>
<tr>
<td> multiCall(sessionId, array calls,array options) </td>
<td> Call the API resource’s methods that are allowed for current session. See Notes below. </td>
<td> array </td>
</tr>
<tr>
<td> resources(sessionId) </td>
<td> Return a list of available API resources and methods allowed for the current session. </td>
<td> array </td>
</tr>
<tr>
<td> globalFaults(sessionId) </td>
<td> Return a list of fault messages and their codes that do not depend on any resource. </td>
<td> array </td>
</tr>
<tr>
<td> resourceFaults(sessionId, resourceName) </td>
<td> Return a list of the specified resource fault messages, if this resource is allowed in the current session. </td>
<td> array </td>
</tr>
</tbody></table>

<p><b>Note:</b> For <b>call</b> and <b>multiCall</b>, if no session is specified, you can call only resources that are not protected by ACL.</p>

<p> <b>Note:</b> For <b>multiCall</b>, if the "break" option is specified, multiCall breaks on first error.</p>

<p>The Magento SOAP API v2 does not support the call() and multiCall() methods, and instead provides a separate method for each API resource.</p>

<h2><a name="Introduction-GlobalAPIFaults"></a>Global API Faults</h2>

<p>The following table contains fault codes that apply to all SOAP/XML-RPC API calls.</p>

<table><tbody>
<tr>
<th> Fault Code </th>
<th> Fault Message </th>
</tr>
<tr>
<td> 0 </td>
<td> Unknown Error </td>
</tr>
<tr>
<td> 1 </td>
<td> Internal Error. Please see log for details. </td>
</tr>
<tr>
<td> 2 </td>
<td> Access denied. </td>
</tr>
<tr>
<td> 3 </td>
<td> Invalid API path. </td>
</tr>
<tr>
<td> 4 </td>
<td> Resource path is not callable. </td>
</tr>
</tbody></table>


## SOAP API Version v2

<p>Since Magento 1.3, version v2 of the SOAP API has also been available. The main difference between v1 and v2 is that instead of using methods call and multiCall, it has separate methods for each action.</p>

<p>For example, consider the following PHP code using SOAP v1.</p>
```php
$params = array(array(
    'status'=&gt;array('eq'=&gt;'pending'),
    'customer_is_guest'=&gt;array('eq'=&gt;'1'))
));
$result = $client-&gt;call($sessionId, 'sales_order.list', $params);
```

<p>With SOAP v2, the following code would be equivalent.</p>
```php
$params = array('filter' =&gt; array(
    array('key' =&gt; 'status', 'value' =&gt; 'pending'),
    array('key' =&gt; 'customer_is_guest', 'value' =&gt; '1')
));
$result = $client-&gt;salesOrderList($sessionId, $params);
```

<p>Note that the WSDL for SOAP v1 and SOAP v2 are different. Note that in SOAP v1, customizing the API did not involve changing the WSDL. In SOAP v2, changes to the WSDL are required.</p>

<p>You can configure the SOAP v2 API to be <a href="http://www.ws-i.org/">WS-I</a> compliant in the system configuration menu. To do this, set <b>Services &gt; Magento Core API &gt; WS-I Compliance</b> to <b>Yes</b>.</p>

<p>Note that the WSDL for the SOAP v2 API is different when in WS-I compliant mode.</p>

<p>Using the WS-I compliant SOAP v2 API WSDL, it is easy to automatically generate client classes for Java, .NET, and other languages using standard libraries. </p>


















## WS-I Compliance Mode
<p>Magento provides you with the ability to use two modes for SOAP API V2. These are with WS-I compliance mode enabled and WS-I compliance mode disabled. The first one was introduced to make the system flexible, namely, to increase compatibility with .NET and Java programming languages.</p>

<p>To enable/disable the WS-I compliance mode, perform the following steps:</p>
<ol>
	<li>In the Magento Admin Panel, go to <b>System &gt; Configuration &gt; Magento Core API</b>.</li>
	<li>In the WS-I Compliance drop-down, select <b>Yes</b> to enable the WS-I compliance mode and <b>No</b> to disable the WS-I compliance mode, correspondingly.<br/>
    <img src="{{ site.baseurl }}/guides/m1x/images/soap_wsi-config.png" style="border: 1px solid black"/></li>
</ol>

<p>The WS-I compliant mode uses the same WSDL endpoint as SOAP API V2 does. The key difference is that XML namespaces are used in WS-I compliance mode.<br/>
</p>

<p>WSDL file with disabled WS-I compliance mode:<br/>
<img src="{{ site.baseurl }}/guides/m1x/images/soap_wsdl.png" style="border: 1px solid black"/></p>

<p>WSDL file with enabled WS-I compliance mode:<br/>
<img src="{{ site.baseurl }}/guides/m1x/images/soap_wsdl-wsi.png" style="border: 1px solid black"/></p>


























## Creating a Custom API or Extending the Core API

<p> The Core API allows you to manage a set of common resources used in Magento. However, you may choose to have your own set of resources to manage, or you may wish to extend the Core API to handle additional resources. </p>

<p> This tutorial leads you through the process of creating a custom API for a customer module that handles basic customer information. </p>

<p> <b>Note:</b> This tutorial applies to v1 of the API. </p>

<p> To learn more about the Core API, to read Magento Core API calls. </p>

<p> For general information about the Magento API, go to the Introduction.</p>

### 1. Creating an XML File that Will Define the API Resource

<p> Create a file named <b>api.xml</b> in the /etc folder in the customer module. Start with the empty structure, as follows: </p>
```
&lt;config&gt;
    &lt;api&gt;
        &lt;resources&gt;
        &lt;/resources&gt;
        &lt;acl&gt;
            &lt;resources&gt;
                &lt;all&gt;
                &lt;/all&gt;
            &lt;/resources&gt;
        &lt;/acl&gt;
    &lt;/api&gt;
&lt;/config&gt;
```

### 2. Adding a Resource Named Customer

<p> Add an element named customer in the &lt;resources&gt; element. Add a &lt;methods&gt; element, with elements for list, create, info, update and remove methods for customer resource. </p>

<p> Note that: </p>
<ul>
	<li>list will return all customers</li>
	<li>create will create a new customer</li>
	<li>info will return data on a specified customer</li>
	<li>update will update data on a specified customer</li>
	<li>remove will delete data on a specified customer</li>
</ul>


```xml
&lt;config&gt;
    &lt;api&gt;
....
        &lt;resources&gt;
            &lt;customer translate="title" module="customer"&gt;
                &lt;title&gt;Customer Resource&lt;/title&gt;
                &lt;methods&gt;
                    &lt;list translate="title" module="customer"&gt;
                        &lt;title&gt;Retrieve customers&lt;/title&gt;
                    &lt;/list&gt;
                    &lt;create translate="title" module="customer"&gt;
                        &lt;title&gt;Create customer&lt;/title&gt;
                    &lt;/create&gt;
                    &lt;info translate="title" module="customer"&gt;
                        &lt;title&gt;Retrieve customer data&lt;/title&gt;
                    &lt;/info&gt;
                    &lt;update translate="title" module="customer"&gt;
                        &lt;title&gt;Update customer data&lt;/title&gt;
                    &lt;/update&gt;
                    &lt;delete&gt;
                        &lt;title&gt;Delete customer&lt;/title&gt;
                    &lt;/delete&gt;
                &lt;/methods&gt;
                &lt;faults module="customer"&gt;
                &lt;/faults&gt;
            &lt;/customer&gt;
        &lt;/resources&gt;
....
    &lt;/api&gt;
&lt;/config&gt;
```

### 3. Adding Faults

<p> The resource can return some faults, so add a &lt;faults&gt; element in the customer element, and list the various faults. </p>
```xml
&lt;config&gt;
    &lt;api&gt;
....
        &lt;resources&gt;
            &lt;customer translate="title" module="customer"&gt;
....
                &lt;faults module="customer"&gt; &lt;!-- module="customer" specifies the module which will be used for translation. --&gt;
                    &lt;data_invalid&gt; &lt;!-- if we get invalid input data for customers --&gt;
                        &lt;code&gt;100&lt;/code &gt;
                        &lt;!-- we cannot know all the errors that can appear, their details can be found in error message for call --&gt;
                        &lt;message&gt;Invalid customer data. Details in error message.&lt;/message&gt;
                    &lt;/data_invalid&gt;
                    &lt;filters_invalid&gt;
                        &lt;code&gt;101&lt;/code &gt;
                        &lt;message&gt;Invalid filters specified. Details in error message.&lt;/message&gt;
                    &lt;/filters_invalid&gt;
                    &lt;not_exists&gt;
                        &lt;code&gt;102&lt;/code &gt;
                        &lt;message&gt;Customer doesn't exist.&lt;/message&gt;
                    &lt;/not_exists&gt;
                    &lt;not_deleted&gt;
                        &lt;code&gt;103&lt;/code &gt;
                        &lt;message&gt;Customer was not deleted. Details in error message.&lt;/message&gt;
                    &lt;/not_deleted&gt;
                &lt;/faults&gt;
            &lt;/customer&gt;
        &lt;/resources&gt;
....
    &lt;/api&gt;
&lt;/config&gt;
```

### 4. Describing the Access Control List (ACL) for the Resource

<p> In order to prevent unauthorized access to our custom API, you must first list the resources that are restricted within the &lt;acl&gt; element. </p>
```xml
&lt;config&gt;
    &lt;api&gt;
....
        &lt;acl&gt;
            &lt;resources&gt;
                    &lt;customer translate="title" module="customer"&gt;
                         &lt;title&gt;Customers&lt;/title&gt;
                         &lt;list translate="title" module="customer"&gt;
                            &lt;title&gt;View All&lt;/title&gt;
                         &lt;/list&gt;
                         &lt;create translate="title" module="customer"&gt;
                            &lt;title&gt;Create&lt;/title&gt;
                         &lt;/create&gt;
                         &lt;info translate="title" module="customer"&gt;
                            &lt;title&gt;Get Info&lt;/title&gt;
                         &lt;/info&gt;
                         &lt;update translate="title" module="customer"&gt;
                            &lt;title&gt;Update&lt;/title&gt;
                         &lt;/update&gt;
                         &lt;delete translate="title" module="customer"&gt;
                            &lt;title&gt;Delete&lt;/title&gt;
                         &lt;/delete&gt;
                    &lt;/customer&gt;
            &lt;/resources&gt;
        &lt;/acl&gt;
    &lt;/api&gt;
&lt;/config&gt;
```

<p> Then, map ACL resources to API resource methods by adding an &lt;acl&gt; element to each part of the resource that needs restricting: </p>
```xml
&lt;config&gt;
    &lt;api&gt;
        &lt;resources&gt;
            &lt;customer translate="title" module="customer"&gt;
                &lt;title&gt;Customer Resource&lt;/title&gt;
                &lt;acl&gt;customer&lt;/acl&gt;
                &lt;methods&gt;
                    &lt;list translate="title" module="customer"&gt;
                        &lt;title&gt;Retrieve customers&lt;/title&gt;
                        &lt;acl&gt;customer/list&lt;/acl&gt;
                    &lt;/list&gt;
                    &lt;create translate="title" module="customer"&gt;
                        &lt;title&gt;Create customer&lt;/title&gt;
                        &lt;acl&gt;customer/create&lt;/acl&gt;
                    &lt;/create&gt;
                    &lt;info translate="title" module="customer"&gt;
                        &lt;title&gt;Retrieve customer data&lt;/title&gt;
                        &lt;acl&gt;customer/info&lt;/acl&gt;
                    &lt;/info&gt;
                    &lt;update translate="title" module="customer"&gt;
                        &lt;title&gt;Update customer data&lt;/title&gt;
                        &lt;acl&gt;customer/update&lt;/acl&gt;
                    &lt;/update&gt;
                    &lt;delete&gt;
                        &lt;title&gt;Delete customer&lt;/title&gt;
                        &lt;acl&gt;customer/delete&lt;/acl&gt;
                    &lt;/delete&gt;
                &lt;/methods&gt;
              ....
            &lt;/customer&gt;
        &lt;/resources&gt;
....
    &lt;/api&gt;
&lt;/config&gt;```

### 5. Creating PHP Code

<p> Next, write some PHP code to access the resources. Start by creating a class called Mage_Customer_Model_Customer_Api that extends Mage_Api_Model_Resource_Abstract. Save it into a file called <b>api.php</b>. </p>
```php
class Mage_Customer_Model_Customer_Api extends Mage_Api_Model_Resource_Abstract
{

    public function create($customerData)
    {
    }

    public function info($customerId)
    {
    }

    public function items($filters)
    {
    }

    public function update($customerId, $customerData)
    {
    }

    public function delete($customerId)
    {
    }
}
```

<p> Note that you cannot create method "list" because it’s a PHP keyword, so instead the method is named items. In order to make this work, add a &lt;method&gt; element into the &lt;list&gt; element in <b>api.xml</b>, as shown below.</p>
```xml
&lt;config&gt;
    &lt;api&gt;
        &lt;resources&gt;
            &lt;customer translate="title" module="customer"&gt;
                &lt;model&gt;customer/api&lt;/model&gt; &lt;!-- our model --&gt;
                &lt;title&gt;Customer Resource&lt;/title&gt;
                &lt;acl&gt;customer&lt;/acl&gt;
                &lt;methods&gt;
                    &lt;list translate="title" module="customer"&gt;
                        &lt;title&gt;Retrieve customers&lt;/title&gt;
                        &lt;method&gt;items&lt;/method&gt; &lt;!-- we have another method name inside our resource --&gt;
                        &lt;acl&gt;customer/list&lt;/acl&gt;
                    &lt;/list&gt;
....
                &lt;/methods&gt;
....
        &lt;/resources&gt;
....
    &lt;/api&gt;
&lt;/config&gt;
```

<p> Now add some simple functionality to the Mage_Customer_Model_Api methods you created. </p>

<p> Create a customer: </p>
```php
    public function create($customerData)
    {
        try {
            $customer = Mage::getModel('customer/customer')
                -&gt;setData($customerData)
                -&gt;save();
        } catch (Mage_Core_Exception $e) {
            $this-&gt;_fault('data_invalid', $e-&gt;getMessage());
            // We cannot know all the possible exceptions,
            // so let's try to catch the ones that extend Mage_Core_Exception
        } catch (Exception $e) {
            $this-&gt;_fault('data_invalid', $e-&gt;getMessage());
        }
        return $customer-&gt;getId();
    }
```

<p> Retrieve customer info: </p>
```php
    public function info($customerId)
    {
        $customer = Mage::getModel('customer/customer')-&gt;load($customerId);
        if (!$customer-&gt;getId()) {
            $this-&gt;_fault('not_exists');
            // If customer not found.
        }
        return $customer-&gt;toArray();
        // We can use only simple PHP data types in webservices.
    }
```


<p> Retrieve list of customers using filtering: </p>
```php
    public function items($filters)
    {
        $collection = Mage::getModel('customer/customer')-&gt;getCollection()
            -&gt;addAttributeToSelect('*');

        if (is_array($filters)) {
            try {
                foreach ($filters as $field =&gt; $value) {
                    $collection-&gt;addFieldToFilter($field, $value);
                }
            } catch (Mage_Core_Exception $e) {
                $this-&gt;_fault('filters_invalid', $e-&gt;getMessage());
                // If we are adding filter on non-existent attribute
            }
        }

        $result = array();
        foreach ($collection as $customer) {
            $result[] = $customer-&gt;toArray();
        }

        return $result;
    }
```


<p> Update a customer: </p>
```php
    public function update($customerId, $customerData)
    {
        $customer = Mage::getModel('customer/customer')-&gt;load($customerId);

        if (!$customer-&gt;getId()) {
            $this-&gt;_fault('not_exists');
            // No customer found
        }

        $customer-&gt;addData($customerData)-&gt;save();
        return true;
    }
```

<p> Delete a customer: </p>
```php
    public function delete($customerId)
    {
        $customer = Mage::getModel('customer/customer')-&gt;load($customerId);

        if (!$customer-&gt;getId()) {
            $this-&gt;_fault('not_exists');
            // No customer found
        }

        try {
            $customer-&gt;delete();
        } catch (Mage_Core_Exception $e) {
            $this-&gt;_fault('not_deleted', $e-&gt;getMessage());
            // Some errors while deleting.
        }

        return true;
    }
```

### Creating a Custom Adapter

<p> In order to create custom webservice adapter, implement the Mage_Api_Model_Server_Adapter_Interface, which is shown below.</p>
```php
interface Mage_Api_Model_Server_Adapter_Interface
{
    /**
     * Set handler class name for webservice
     *
     * @param string $handler
     * @return Mage_Api_Model_Server_Adapter_Interface
     */
    function setHandler($handler);

    /**
     * Retrieve handler class name for webservice
     *
     * @return string [basc]
     */
    function getHandler();

    /**
     * Set webservice API controller
     *
     * @param Mage_Api_Controller_Action $controller
     * @return Mage_Api_Model_Server_Adapter_Interface
     */
    function setController(Mage_Api_Controller_Action $controller);

    /**
     * Retrieve webservice API controller
     *
     * @return Mage_Api_Controller_Action
     */
    function getController();

    /**
     * Run webservice
     *
     * @return Mage_Api_Model_Server_Adapter_Interface
     */
    function run();

    /**
     * Dispatch webservice fault
     *
     * @param int $code
     * @param string $message
     */
    function fault($code, $message);

}
```

<p> Here is an example implementation for XML-RPC:</p>
```php
class Mage_Api_Model_Server_Adapter_Customxmlrpc
    extends Varien_Object
    implements Mage_Api_Model_Server_Adapter_Interface
{
     /**
      * XmlRpc Server
      *
      * @var Zend_XmlRpc_Server
      */
     protected $_xmlRpc = null;

     /**
     * Set handler class name for webservice
     *
     * @param string $handler
     * @return Mage_Api_Model_Server_Adapter_Xmlrpc
     */
    public function setHandler($handler)
    {
        $this-&gt;setData('handler', $handler);
        return $this;
    }

    /**
     * Retrieve handler class name for webservice
     *
     * @return string
     */
    public function getHandler()
    {
        return $this-&gt;getData('handler');
    }

     /**
     * Set webservice API controller
     *
     * @param Mage_Api_Controller_Action $controller
     * @return Mage_Api_Model_Server_Adapter_Xmlrpc
     */
    public function setController(Mage_Api_Controller_Action $controller)
    {
         $this-&gt;setData('controller', $controller);
         return $this;
    }

    /**
     * Retrieve webservice API controller
     *
     * @return Mage_Api_Controller_Action
     */
    public function getController()
    {
        return $this-&gt;getData('controller');
    }

    /**
     * Run webservice
     *
     * @param Mage_Api_Controller_Action $controller
     * @return Mage_Api_Model_Server_Adapter_Xmlrpc
     */
    public function run()
    {
        $this-&gt;_xmlRpc = new Zend_XmlRpc_Server();
        $this-&gt;_xmlRpc-&gt;setClass($this-&gt;getHandler());
        $this-&gt;getController()-&gt;getResponse()
            -&gt;setHeader('Content-Type', 'text/xml')
            -&gt;setBody($this-&gt;_xmlRpc-&gt;handle());
        return $this;
    }

    /**
     * Dispatch webservice fault
     *
     * @param int $code
     * @param string $message
     */
    public function fault($code, $message)
    {
        throw new Zend_XmlRpc_Server_Exception($message, $code);
    }
}
```

<p><b>Notes:</b> The setHandler, getHandler, setController and getController methods have a simple implementation that uses the Varien_Object getData and setData methods.</p>

<p> The run and fault methods are a native implementation for an XML-RPC webservice. The run method defines webservice logic in this adapter for creating an XML-RPC server to handle XML-RPC requests. </p>
```php
public function run()
    {
        $this-&gt;_xmlRpc = new Zend_XmlRpc_Server();
        $this-&gt;_xmlRpc-&gt;setClass($this-&gt;getHandler());
        $this-&gt;getController()-&gt;getResponse()
            -&gt;setHeader('Content-Type', 'text/xml')
            -&gt;setBody($this-&gt;_xmlRpc-&gt;handle());
        return $this;
    }
```

<p> The "fault" method allows you to send fault exceptions for XML-RPC service when handling requests. </p>
```php
public function fault($code, $message)
    {
        throw new Zend_XmlRpc_Server_Exception($message, $code);
    }
```

### Common Error Messages

<p> The following are common error messages that you might receive when creating your own custom API. </p>

<p><b>Invalid API path</b></p>

<p> This error occurs when the methods listed in the <b>api.xml</b> file do not correspond exactly with those used in your PHP file. </p>

<p> For example, in your api.xml file, you might have this: </p>
```xml
&lt;config&gt;
    &lt;api&gt;
        &lt;resources&gt;
            &lt;checkout_cart translate="title" module="checkout"&gt;
                &lt;model&gt;checkout/cart_api&lt;/model&gt;
                &lt;title&gt;Cart API&lt;/title&gt;
                &lt;methods&gt;
                    &lt;list translate="title" module="checkout"&gt;
                        &lt;title&gt;Retrieve cart data&lt;/title&gt;
                        &lt;method&gt;info&lt;/method&gt;
                    &lt;/list&gt;
                &lt;/methods&gt;
            &lt;/checkout_cart&gt;
        &lt;/resources&gt;
    ...
    &lt;/api&gt;
&lt;/config&gt;
```

<p> You should have a corresponding info method in your PHP file. </p>
```php
class Mage_Checkout_Model_Cart_Api extends Mage_Cart_Model_Api_Resource
{
    public function info()
    {
        ...
    }
}
``

<p> If you are missing this method, the error "Invalid API path" will be returned. </p>