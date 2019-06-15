import { Illuminsight } from 'types/illuminsight';

export const testTags: Illuminsight.Tag[] = [
  { id: 1556915133433, name: 'alpha' },
  { id: 1556915133434, name: 'bravo' },
  { id: 1556915133435, name: 'charlie' },
  { id: 1556915133436, name: 'delta' }
];

export const testPub: Illuminsight.Pub = {
  authors: 'Jane Austen',
  bookmark: { section: 0, element: 0 },
  id: 1556915133437,
  name: 'Pride and Prejudice',
  cover: 'images/cover.jpg',
  published: -4952074022000,
  toc: [
    { section: 0, element: 0, title: 'Title' },
    { section: 1, element: 0, title: 'Pride and Prejudice' },
    { section: 2, element: 0, title: 'Index' }
  ],
  sections: 3,
  starred: false,
  tags: [],
  version: process.enve.ASTPUB_VERSION,
  words: '123'
};

export const testAST: Illuminsight.AST[] = [
  {
    n: 'h1',
    c: ['Heading 1']
  },
  {
    n: 'p',
    c: [
      'This is a paragraph',
      {
        n: 'a',
        c: ['with a link'],
        a: { href: 'https://example.com' }
      },
      'and',
      {
        n: 'em',
        c: [
          {
            n: 'strong',
            c: ['strongly']
          },
          'emphasised text'
        ]
      },
      'and',
      {
        n: 'code',
        c: ['inline code']
      }
    ]
  },
  {
    n: 'h2',
    c: ['Heading 2']
  },
  { n: 'hr' },
  {
    n: 'img',
    a: {
      src: 'images/0.png',
      alt: 'A picture of ...'
    }
  },
  {
    n: 'ul',
    c: [
      {
        n: 'li',
        c: ['UL item #1']
      },
      {
        n: 'li',
        c: ['UL item #2']
      }
    ]
  },
  {
    n: 'ol',
    c: [
      {
        n: 'li',
        c: ['OL item #1']
      },
      {
        n: 'li',
        c: ['OL item #2']
      }
    ]
  },
  {
    n: 'pre',
    c: [
      {
        n: 'code',
        c: ['code block line 1\ncode block line 2']
      }
    ]
  }
];

export const alternateTestAST: Illuminsight.AST[] = [
  { n: 'h1', c: ['Lorem Ipsum ...'] },
  {
    n: 'p',
    c: [
      '... dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in vitae. Gravida quis blandit turpis cursus in hac. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed. Sed cras ornare arcu dui. Nisi porta lorem mollis aliquam ut porttitor leo a. Sit amet cursus sit amet dictum sit amet. Faucibus in ornare quam viverra orci sagittis. Quis vel eros donec ac odio tempor. Elementum curabitur vitae nunc sed velit dignissim sodales ut. Lacus laoreet non curabitur gravida arcu ac. Tempor orci eu lobortis elementum nibh tellus. Nisi est sit amet facilisis. Tristique risus nec feugiat in fermentum posuere urna.'
    ]
  },
  {
    n: 'p',
    c: [
      'Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Sit amet luctus venenatis lectus magna fringilla. Consectetur adipiscing elit duis tristique sollicitudin. Metus aliquam eleifend mi in nulla posuere. Orci eu lobortis elementum nibh tellus molestie nunc. Consequat semper viverra nam libero justo laoreet sit. Consequat mauris nunc congue nisi. Sem integer vitae justo eget. Habitant morbi tristique senectus et netus. Id neque aliquam vestibulum morbi blandit. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero id. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. Vel facilisis volutpat est velit.'
    ]
  },
  {
    n: 'p',
    c: [
      'Turpis massa tincidunt dui ut ornare lectus sit amet. Ultricies mi eget mauris pharetra et. Velit egestas dui id ornare arcu odio ut. Posuere lorem ipsum dolor sit amet consectetur. Risus quis varius quam quisque id. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Viverra vitae congue eu consequat ac felis donec et odio. Nunc eget lorem dolor sed viverra. At lectus urna duis convallis convallis. Pharetra pharetra massa massa ultricies mi. Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Lectus quam id leo in vitae turpis massa sed. Viverra tellus in hac habitasse platea dictumst. Netus et malesuada fames ac turpis egestas.'
    ]
  },
  {
    n: 'p',
    c: [
      'Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Dignissim suspendisse in est ante in nibh. Facilisis mauris sit amet massa vitae tortor condimentum. Sit amet nulla facilisi morbi tempus. In vitae turpis massa sed elementum tempus egestas sed. Vel quam elementum pulvinar etiam non quam lacus. Massa massa ultricies mi quis hendrerit dolor magna. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Viverra justo nec ultrices dui sapien. Pellentesque elit eget gravida cum sociis natoque penatibus. Diam volutpat commodo sed egestas egestas fringilla phasellus. Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada.'
    ]
  },
  {
    n: 'p',
    c: [
      'Erat imperdiet sed euismod nisi porta lorem mollis aliquam ut. Gravida cum sociis natoque penatibus et. Sit amet est placerat in egestas erat imperdiet. Eu feugiat pretium nibh ipsum consequat nisl vel pretium. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Nunc vel risus commodo viverra maecenas. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium.'
    ]
  }
];

export const testWikitext = `{{other uses}}
{{more citations needed|date=April 2018}}
{{Infobox book| <!-- See Wikipedia:WikiProject_Novels or Wikipedia:WikiProject_Books -->
| name          = Blood Meridian or the Evening Redness in the West
| title_orig    =
| translator    =
| image         = CormacMcCarthy BloodMeridian.jpg
| caption       = First edition cover
| author        = [[Cormac McCarthy]]
| cover_artist  =
| country       = United States
| language      = English
| series        =
| genre         = [[Western (genre)|Western]], [[historical novel]]
| publisher     = [[Random House]]
| release_date  = April 1985
| media_type    = Print ([[Hardcover|hardback]] and [[paperback]])
| pages         = 337 pp (first edition, hardback)
| isbn          = 0-394-54482-X
| isbn_note     = (first edition, hardback)
| dewey         = 813/.54 19
| congress      = PS3563.C337 B4 1985
| oclc          = 234287599
}}

'''''Blood Meridian or The Evening Redness in the West''''' is a [[1985 in literature|1985]] [[Epic (genre)|epic]] [[Western (genre)|Western]] (or [[Revisionist Western|anti-Western]])<ref>{{cite journal |last=Kollin |first=Susan |title=Genre and the Geographies of Violence: Cormac McCarthy and the Contemporary Western |journal=Contemporary Literature |volume=42 |issue=3 |publisher=University of Wisconsin Press |year=2001 |pages=557–88 |jstor=1208996 }}</ref><ref>Hage, Erik. ''Cormac McCarthy: A Literary Companion. North Carolina: 2010. p. 45</ref> novel by American author [[Cormac McCarthy]]. McCarthy's fifth book, it was published by [[Random House]].

The majority of the story follows a teenager referred to only as "the kid," with the bulk of the text devoted to his experiences with the [[John Joel Glanton|Glanton gang]], a historical group of [[scalping|scalp hunters]] who massacred [[Indigenous peoples of the Americas|Native Americans]] and others in the [[United States–Mexico border]]lands from 1849 to 1850 for bounty, pleasure, and eventually out of nihilistic habit. The role of [[antagonist]] is gradually filled by [[Judge Holden]], a physically massive, highly-educated, exceptionally multi-talented member of the gang, depicted as completely bald from head to toe.

Although the novel initially generated only lukewarm critical and commercial reception, it has since become highly acclaimed and is widely recognized as McCarthy's masterpiece, as well as one of the greatest American novels of all time.<ref>{{Cite web|url=http://www.avclub.com/articles/harold-bloom-on-blood-meridian,29214/ |title= Harold Bloom on Blood Meridian }}</ref>

==Plot==
The novel follows an adolescent runaway from Tennessee with a predilection for violence, known only as "the kid," who is introduced as being born during the famous [[Leonids]] [[meteor shower]] of 1833. In the late 1840s, he first encounters an enormous and completely hairless character, named Judge Holden, at a [[Revival meeting|religious revival]] in [[Nacogdoches, Texas]]. There, Holden shows his dark nature by falsely accusing a preacher of raping both a young girl and a goat, inciting those attending the revival to physically attack the preacher.

The kid journeys on alone on his mule through the plains of [[eastern Texas]], and he spends a night in the shelter of a recluse before arriving in "Bexar". After a violent encounter with a bartender, which establishes the kid as a formidable fighter, he joins a party of ill-armed [[United States Army]] [[Irregular military|irregulars]], led by a Captain White, on a [[Filibuster (military)|filibustering mission]] to claim Mexican land for the United States. Shortly after entering [[Mexico]], they are attacked, and many killed, by a band of [[Comanche]] warriors. Arrested in [[Chihuahua (state)|Chihuahua]], the kid is set free when his cell neighbor and prior acquaintance from Texas: the earless Louis Toadvine, tells the authorities that the two of them would make useful recruits for the state's newly-hired scalp hunting operation led by John Joel Glanton.

Toadvine and the kid consequently join Glanton's gang. The bulk of the novel details the gang's conversations and depraved, murderous activities as they travel on horseback throughout the borderlands. The gang encounters a [[traveling carnival]]. The gang originally contracts with various regional leaders to exterminate [[Apache]]s and is given a [[bounty (reward)|bounty]] for each scalp they recover. Before long, however, they murder almost anything in their path, including peaceful agrarian Indians, unprotected Mexican villagers, and even Mexican and American soldiers.

Judge Holden, who re-enters the story as a fellow scalp hunter in the Glanton gang, is presented as a profoundly mysterious and awe-inspiring figure; the others seem to regard him as not quite human. Despite his refined manner and remarkable intellect, the judge often proves to be among the most ruthless and bloodthirsty members of the gang and is strongly implied to prey on children during their travels. According to an ex-priest gang member named Tobin, the Glanton gang first met the judge while fleeing from the onslaught of a much larger group of Apaches. In the middle of the desert, the gang found Holden sitting on an enormous boulder, where he seemed to be waiting for them all. He took them to an extinct volcano, and improvised gunpowder from natural materials, enough to give them the advantage against their Apache pursuers. When the kid remembers seeing Holden in Nacogdoches, Tobin explains that each man in the gang claims to have met the judge at some point before joining Glanton's gang.

After months of marauding, the gang crosses into the [[Mexican Cession]], where they set up a systematic and brutal robbery operation at a ferry on the [[Colorado River]] near [[Yuma, Arizona]]. Local [[Quechan|Yuma]] (Quechan) Indians are approached to help the gang gain control of the ferry from its original owner, but Glanton's gang betrays the natives, using their presence and previously coordinated attack on the ferry as an excuse to seize the ferry's munitions and slaughter the Yuma. Because of the new operators' brutal ways, a group of US Army soldiers sets up a second ferry at a [[ford (crossing)|ford]] upriver to cross—which the Yuma briefly appropriate until their ferryman is decapitated and thrown in the river. Eventually, after the gang had amassed a large fortune through robbing settlers using the ferry, the Yumas suddenly attack the gang and kill most of them including Glanton, though Holden (after fighting off the Yumas using his immense strength to level a [[howitzer]] by hand) survives and escapes.

The kid, Toadvine, and Tobin are among the few other survivors who escape into the desert, although the kid takes an arrow in the leg. Heading west together, the kid and Tobin encounter a weaponless and hatless Judge Holden and his accompanying imbecile arriving at a watering-hole. The judge negotiates successfully for Toadvine's hat and unsuccessfully for the kid's pistol, and invites them to share in the 'common'  water. The kid and Tobin leave the watering hole and move on through the desert. The next evening at another watering site, they have a surprise-attack shoot-out with the judge, who fires a non-fatal shot to Tobin's neck. The kid shoots the two horses the judge came with. As Tobin and the kid hide among bones near the desert creek, the judge delivers a speech about property rights (regarding the shot horses) and advises the kid to reveal himself. Ignoring this, Tobin and the kid continue their travels, both wounded and much weakened. The judge follows the trail and them from a few miles behind. The next day the duo move off the trail and hide, hoping to let the judge pass them by. The judge does repeatedly pass by them, quite near and initially unaware; and soon addresses them aloud, knowing they are hiding nearby.  Although the kid has had three easy clear-shot opportunities to shoot the judge as Tobin strongly advises, he doesn't take the shots. The judge and the imbecile then leave. Tobin and the kid are in quite bad shape and would likely have died out in the desert, but some benevolent Indians rescue them and they survive.

Both parties end up in [[San Diego, California|San Diego]], but the kid gets separated from Tobin when he is caught by local authorities and imprisoned. Holden visits him in jail, stating that he told the jailers "the truth": that the kid alone was responsible for the end of the Glanton gang. The kid declares that the judge was responsible for the gang's evils, but the judge denies it. After reaching through the cell bars to try to touch the kid, Holden leaves the kid alone, stating that he "has errands." The kid is released and seeks a doctor to treat his wound. Under the influence of medicinal [[Diethyl Ether|ether]], he hallucinates that the judge is visiting him, along with a curious man who forges coins. The kid recovers and seeks out Tobin, with no luck. He makes his way to [[Los Angeles]], where he witnesses the executions of Toadvine and David Brown—leaving Tobin, whose fate is uncertain, the judge, and the kid as the remaining alive gang members.

Following this, the kid again wanders across the American West. In 1878, he makes his way to [[Fort Griffin]], Texas and is now referred to by the author as "the man." The lawless city is a center for processing the remains of the [[American bison]], which have been hunted nearly to extinction. At a [[Western saloon|saloon]], where a traveling roadshow performs with a trained dancing bear, the man yet again meets the judge, who does not seem to have aged in the intervening years. Holden calls the man "the last of the true." and the pair talk on equal terms. Holden describes the man as a disappointment, stating that the man held in his heart "clemency for the heathen." Holden declares prophetically that the man has arrived at the saloon for "the dance." A drunk man shoots the dancing bear, and the man tells the judge, "You ain't nothin'," and, noting the dead bear, says that "even a dumb animal can dance."

The man hires a prostitute, then afterward goes to an [[outhouse]] under another meteor shower. In the outhouse, he is surprised by the naked judge there waiting for him, who "gather[s] him in his arms against his immense and terrible flesh." This is the last mention of the man. As two men from the saloon approach the outhouse, another man admonishes them not to open the door. They do so anyway, and gaze in awed horror at what they see, stating only, "Good God almighty." The last paragraph finds the judge back in the saloon, dancing in the nude and playing fiddle wildly among the drunkards and prostitutes, claiming that he never sleeps, and will never die.

A brief [[epilogue]] features an unspecified person augering a row of holes across the prairie. The worker sparks a fire in each of the holes while an assortment of passionless wanderers crosses the row. The line of holes is described as "a validation of sequence and causality as if each round and perfect hole owed its existence to the one before it there on that prairie."

==Characters==
===Major characters===
* The kid: The novel's anti-heroic protagonist, the kid is a Tennessean initially in his mid-teens whose mother died in [[childbirth]] and who flees from his father to Texas. He is said to have a disposition for bloodshed and is involved in many vicious actions early on; he takes up inherently violent professions, specifically being recruited by murderers including Captain White, and later, by Glanton and his gang, to secure release from a prison in [[Chihuahua (state)|Chihuahua, Mexico]]. The kid takes part in many of the Glanton gang's scalp-hunting rampages, but gradually displays a moral fiber that ultimately puts him at odds with the Judge. "The kid" is later, as an adult, referred to as "the man," when he encounters the judge again after nearly three decades.
* [[Judge Holden]], '''or "the judge"''': An enormous, pale, and hairless man, who often seems almost mythical or supernatural. Possessing peerless knowledge and talent in everything from dance to legal argument, Holden is a dedicated examiner and recorder of the natural world and a supremely violent and perverted character. He rides with (though largely does not interact with) Glanton's gang after they find him sitting on a rock in the middle of the desert and he saves them from an Apache attack using his exceptional intellect, skill, and nearly superhuman strength. It is hinted at that he and Glanton have forged some manner of a pact, possibly for the very lives of the gang members.  He gradually becomes the antagonist to the kid after the dissolution of Glanton's gang, occasionally having brief reunions with the kid to mock, debate, or terrorize him. Unlike the rest of the gang, Holden is socially refined and remarkably well-educated; however, he perceives the world as ultimately violent, [[fatalism|fatalistic]], and liable to an endless cycle of bloody conquest, with [[human nature]] and autonomy defined by the will to violence; he asserts, ultimately, that "War is god."
* '''Louis Toadvine''': A seasoned outlaw the kid originally encounters in a vicious brawl and who then burns down a hotel, Toadvine is distinguished by his head which has no ears and his forehead branded with the letters H, T, (standing for "horse thief") and F. He later reappears unexpectedly as a cellmate of the kid in the Chihuahua prison. Here, he somewhat befriends the kid, negotiating his and the kid's release in return for joining Glanton's gang, to whom he claims dishonestly that he and the kid are experienced scalp hunters. Toadvine is not as depraved as the rest of the gang and opposes the judge's methods ineffectually, but is still a violent individual himself. He is hanged in Los Angeles alongside David Brown.

===Other recurring characters===
* '''Captain White, or "the captain"''': An ex-professional soldier and [[American exceptionalism|American supremacist]] who believes that Mexico is a lawless nation destined to be conquered by the United States, Captain White leads a ragtag group of militants into Mexico. The kid joins Captain White's escapades before his capture and imprisonment; he later discovers that White has been decapitated by his enemies.
* [[John Joel Glanton]], or simply '''Glanton''': Glanton is the American leader (sometimes deemed "captain") of a band of [[Scalping|scalphunters]] who murder Indians as well as Mexican civilians and militants alike. His history and appearance are not clarified, except that he is physically small with black hair and has a wife and child in Texas though he has been banned from returning there because of his criminal record. A clever strategist, his last major action is to seize control of a profitable Colorado River ferry, which leads him and most of his gang to be killed in an ambush by Yuma Indians.
* '''Tobin, or "the ex-priest"''': A former [[novice]] of the [[Society of Jesus]], Tobin instead turns to a life of crime in Glanton's gang, though remains deeply religious. He feels an apparently friend-like bond with the kid and abhors the judge and his philosophy; he and the judge gradually become great spiritual enemies. Although he survives the Yuma massacre of Glanton's gang, during his escape in the desert he is shot in the neck by the judge and seeks medical attention in San Diego. His ultimate fate, however, remains unknown.
* '''David Brown''': An especially radical member of the Glanton band, David Brown becomes known for his dramatic displays of violence.  He wears a necklace of human ears (similar to the one worn by Bathcat before his immolation). He is arrested in San Diego and sought out by Glanton personally, who seems especially concerned to see him freed (though Brown ends up securing his own release). Though he survives the Yuma massacre, he is captured with Toadvine in Los Angeles and both are hanged.
* '''John Jackson''': "John Jackson" is a name shared by two men in Glanton's gang— one black, one white— who detest one another and whose tensions frequently rise  when in each other's presence. After trying to drive the black Jackson away from a campfire with a racist remark, the white one is decapitated by the black one; the black Jackson later becomes the first person murdered in the Yuma massacre.

==Themes==
{{refimprove section|date=April 2018}}

===Violence===
A major theme is the warlike nature of man. A show of violence early in the novel consists of the protagonist getting clubbed in the head.<ref>p. 9</ref> Critic [[Harold Bloom]]<ref>Bloom, Harold, ''How to Read and Why''. New York: 2001.</ref> praised ''Blood Meridian'' as one of the best 20th century American novels, describing it as "worthy of [[Herman Melville]]'s ''[[Moby-Dick]]'',"<ref>Bloom, Harold, [http://www.boston.com/news/globe/editorial_opinion/oped/articles/2003/09/24/dumbing_down_american_readers/ "Dumbing down American readers."] ''Boston Globe'', op-ed, September 24, 2003.</ref>  but admitted that he found the book's pervasive violence so shocking that he had several false starts before reading the book entirely. Caryn James argued that the novel's violence was a "slap in the face" to modern readers cut off from the brutality of life, while Terrence Morgan thought that, though initially shocking, the effect of the violence gradually waned until the reader was bored.<ref>Owens, p. 7.</ref> Billy J. Stratton contends that the brutality depicted is the primary mechanism through which McCarthy challenges binaries and promotes his revisionist agenda.<ref>{{cite journal |last=Stratton |first=Billy J. |title=‘el brujo es un coyote’: Taxonomies of Trauma in Cormac McCarthy's Blood Meridian |journal=Arizona Quarterly: A Journal of American Literature, Culture, and Theory |volume=67 |issue=3 |year=2011 |pages=151–172 |doi=10.1353/arq.2011.0020 }}</ref> Lilley argues that many critics struggle with the fact that McCarthy does not use violence for "jury-rigged, symbolic plot resolutions . . . In McCarthy's work, violence tends to be just that; it is not a sign or symbol of something else."<ref name="Lilley, p. 19">Lilley, p. 19.</ref>

===Epigraphs and ending===
Three [[Epigraph (literature)|epigraphs]] open the book: quotations from French writer [[Paul Valéry]], from German [[Christian mystic]] [[Jacob Boehme]], and a 1982 news clipping from the ''[[Yuma Sun]]'' reporting the claim of members of an [[Ethiopia]]n archeological excavation that a fossilized skull three hundred millennia old seemed to have been scalped.
The themes implied by the epigraphs have been variously discussed without specific conclusions.{{citation needed|date=April 2018}}

As noted above concerning the ending, the most common interpretation of the novel is that Holden kills the kid in a Fort Griffin, Texas, outhouse. The fact that the kid's death is not depicted might be significant. ''Blood Meridian'' is a catalog of brutality, depicting, in sometimes explicit detail, all manner of violence, bloodshed, brutality and cruelty. For the dramatic climax to be left undepicted leaves something of a vacuum for the reader: knowing full well the horrors established in the past hundreds of pages, the kid's unstated fate might still be too awful to describe, and too much for the mind to fathom: the sight of the kid's fate leaves several witnesses stunned almost to silence; never in the book does any other character have this response to violence, again underlining the singularity of the kid's fate.

Patrick W. Shaw argues that Holden has sexually violated the protagonist. As Shaw writes, the novel had several times earlier established "a sequence of events that gives us ample information to visualize how Holden molests a child, then silences him with aggression."<ref>Shaw, p. 109.</ref> According to Shaw's argument, Holden's actions in the Fort Griffin outhouse are the culmination of what he desired decades earlier: to rape the kid, then perhaps kill him to silence the only survivor of the Glanton gang. If the judge wanted only to kill the kid, there would be no need for him to undress as he waited in the outhouse. Shaw writes,

{{quote|When the judge assaults the kid in the Fort Griffin jakes… he betrays a complex of psychological, historical and sexual values of which the kid has no conscious awareness, but which are distinctly conveyed to the reader. Ultimately, it is the kid's personal humiliation which impacts the reader most tellingly. In the virile warrior culture which dominates that text and to which the reader has become acclimated, seduction into public homoeroticism is a dreadful fate. We do not see behind the outhouse door to know the details of the kid's corruption. It may be as simple as the embrace that we do witness or as violent as the [[sodomy]] implied by the judge's killing of the Indian children. The kid's powerful survival instinct perhaps suggests that he is a more willing participant than a victim. However, the degree of debasement and the extent of the kid's willingness are incidental. The public revelation of the act is what matters. Other men have observed the kid's humiliation… In such a male culture, public homoeroticism is untenable and it is this sudden revelation that horrifies the observers at Fort Griffin. No other act could offend their masculine sensibilities as the shock they display… This triumph over the kid is what the exhibitionist and homoerotic judge celebrates by dancing naked atop the wall, just as he did after assaulting the half-breed boy.|Patrick W. Shaw|"The Kid's Fate, the Judge's Guilt"<ref>Shaw, p. 117–118.</ref>}}

Yet Shaw’s effort to penetrate the mystery in the jakes has not managed to satisfy other critics,  who have rejected his thesis as more sensational than textual:
{{quote|Patrick W. Shaw's article . . . reviews the controversy over the end of McCarthy's masterpiece: does the judge kill the kid in the 'jakes' or does he merely sexually assault him? Shaw then goes on to review Eric Fromm's distinction between benign and malignant aggression – benign aggression being only used for survival and is rooted in human instinct, whereas malignant aggression is destructive and is based in human character.  It is Shaw's thesis that McCarthy fully accepts and exemplifies Fromm's malignant aggression, which he sees as part of the human condition, and which we do well to heed, for without this acceptation we risk losing ourselves in intellectual and physical servitude. Shaw goes in for a certain amount of special pleading: the Comanches sodomizing their dying victims; the kid's exceptional aggression and ability, so that the judge could not have killed him that easily; the judge deriving more satisfaction from tormenting than from eliminating.  Since the judge considers the kid has reserved some clemency in his soul, Shaw argues, that the only logical step is that the judge humiliates him by sodomy. This is possible, but unlikely. The judge gives one the impression, not so much of male potency, but of impotence.  His mountainous, hairless flesh is more that of a eunuch than a man.  Having suggested paedophilia, Shaw then goes back to read other episodes in terms of the judge's paedophilia:  the hypothesis thus becomes the premise.  And in so arguing, Shaw falls into the same trap of narrative closure for which he has been berating other critics.  The point about ''Blood Meridian'' is that we do not know and we cannot know.|Peter J. Kitson (Ed.)|"The Year's Work in English Studies Volume 78 (1997)"<ref>Kitson, p. 809.</ref>}}

===Gnosticism===
Various discussions by Leo Daugherty, Barclay Owens, Harold Bloom and others, have resulted from the second epigraph of the three which are used by the author to introduce the novel taken from the [[Gnosticism|"Gnostic"]] [[Christian mysticism|mystic]] [[Jakob Böhme|Jacob Boehme]].{{citation needed|date=April 2018}} The quote from Boehme reads as follows: "It is not to be thought that the life of darkness is sunk in misery and lost as if in sorrowing. There is no sorrowing. For sorrow is a thing that is swallowed up in death, and death and dying are the very life of the darkness."<ref>{{cite book |last= Mundik |first=Petra |date=May 15, 2016 |title=A Bloody and Barbarous God: The Metaphysics of Cormac McCarthy |page= 32 |url=https://books.google.com/books?id=QQzbCwAAQBAJ&pg=PA32&lpg=PA32&dq=%22It+is+not+to+be+thought+that+the+life+of+darkness+is+sunk+in+misery+and+lost+as+if+in+sorrowing.+There+is+no+sorrowing.+For+sorrow+is+a+thing+that+is+swallowed+up+in+death,+and+death+and+dying+are+the+very+life+of+the+darkness.%22&source=bl&ots=xOj63kxbcQ&sig=6N9MPa26nn79oGwXhiU-rVQx9jk&hl=en&sa=X&ved=2ahUKEwjBvLak34jdAhV6HTQIHSoTC8EQ6AEwB3oECAUQAQ#v=onepage&q=%22It%20is%20not%20to%20be%20thought%20that%20the%20life%20of%20darkness%20is%20sunk%20in%20misery%20and%20lost%20as%20if%20in%20sorrowing.%20There%20is%20no%20sorrowing.%20For%20sorrow%20is%20a%20thing%20that%20is%20swallowed%20up%20in%20death%2C%20and%20death%20and%20dying%20are%20the%20very%20life%20of%20the%20darkness.%22&f=false |location= |publisher= University of New Mexico Press|accessdate=August 25, 2018 }}</ref> No specific conclusions have been reached concerning its interpretation and the extent of its direct or indirect relevance to the novel.{{citation needed|date=April 2018}}

These critics agree that there are [[Gnostic]] elements present in ''Blood Meridian,'' but they disagree on the precise meaning and implication of those elements. One of the most detailed of these arguments is made by Leo Daugherty in his 1992 article, "''Blood Meridian'' as Gnostic Tragedy." Daugherty argues "Gnostic thought is central to Cormac McCarthy's ''Blood Meridian''" (Daugherty, 122); specifically, the [[Persia]]n-[[Zoroastrianism|Zoroastrian]]-[[Manichaeism|Manichean]] branch of Gnosticism. He describes the novel as a "rare coupling of Gnostic 'ideology' with the 'affect' of [[Greek tragedy|Hellenic tragedy]] by means of depicting how power works in the making and erasing of culture, and of what the human condition amounts to when a person opposes that power and thence gets introduced to [[destiny|fate]]."<ref>Daugherty, p. 129.</ref>

Daugherty sees Holden as an [[Archon (Gnosticism)|archon]], and the kid as a "failed ''[[Pneumatic (Gnosticism)|pneuma]]''."{{citation needed|date=April 2018}} Daugherty makes the interpretive claim that the kid feels a "spark of the alien divine."<ref>Daugherty, Leo. “Gravers False and True: Blood Meridian as Gnostic Tragedy.” Perspectives on Cormac McCarthy. Ed. Edwin T. Arnold and Dianne C. Luce. University Press of Mississippi: Jackson, 1993. 157-172
</ref> Furthermore, the kid rarely initiates violence, usually doing so only when urged by others or in self-defense.{{citation needed|date=April 2018}} Holden, however, speaks of his desire to dominate the earth and all who dwell on it, by any means: from outright violence to deception and trickery.{{citation needed|date=April 2018}} He expresses his wish to become a "[[suzerain]]," one who "rules even when there are other rulers" and whose power overrides all others'.{{citation needed|date=April 2018}} In 2009, Bloom did refer to Boehme in the context of ''Blood Meridian'' as, "a very specific type of [[Kabbalistic]] Gnostic".{{citation needed|date=April 2018}}

Daugherty contends that the staggering violence of the novel can best be understood through a Gnostic lens. "[[Evil]]" as defined by the Gnostics was a far larger, more pervasive presence in human life than the rather tame and "domesticated" [[Satan]] of Christianity. As Daugherty writes, "For [Gnostics], evil was simply everything that ''is'', with the exception of bits of spirit imprisoned here. And what they saw is what we see in the world of ''Blood Meridian''."<ref>Daugherty, p. 124; emphasis in original.</ref> Barcley Owens argues that, while there are undoubtedly Gnostic qualities to the novel, Daugherty's arguments are "ultimately unsuccessful,"<ref>Owens, p. 12.</ref> because Daugherty fails to address the novel's pervasive violence adequately and because he overstates the kid's goodness.{{citation needed|date=April 2018}}

===Theodicy===
Another major theme concerning ''Blood Meridian'' involves the subject of [[theodicy]]. Theodicy in general refers to the issue of the philosophical or theological attempt to justify the existence of that which is metaphysically or philosophically good in a world which contains so much apparent and manifest evil. Douglas Canfield in his essay "Theodicy in ''Blood Meridian''" (in his book ''Mavericks on the Border'', 2001, Lexington University Press)<ref>{{cite book|last=Canfield|first=J. D.| title =Mavericks on the Border| publisher=University Press of Kentucky | year=2001 |page=|isbn=978-0-813-12672-2 }}</ref> asserts that theodicy is the central theme of ''Blood Meridian''. James Wood in his essay for ''[[The New Yorker]]'' entitled "Red Planet" from 2005 took a similar position to this in recognizing the issue of the general justification of metaphysical goodness in the presence of evil in the world as a recurrent theme in the novel.<ref name="NYM">{{cite journal |last= Wood |first=James |date=July 25, 2005 |title=Red Planet: The sanguinary sublime of Cormac McCarthy |url=https://www.newyorker.com/magazine/2005/07/25/red-planet |journal=[[The New Yorker]] |location=New York |publisher= |accessdate=August 25, 2018 }}</ref> This was directly supported by Edwin Turner on 28 September 2010 in his essay on ''Blood Meridian'' for ''Biblioklept''.<ref>{{cite web |last= Turner |first=Edwin |date=September 27, 2010 |title=Blood Meridian |url=https://biblioklept.org/2010/09/27/blood-meridian-cormac-mccarthy/ |location= |publisher= |accessdate=August 25, 2018 }}</ref> Chris Dacus in the ''Cormac McCarthy Journal'' for 2009 wrote the essay entitled, "The West as Symbol of the Eschaton in Cormac McCarthy," where he expressed his preference for discussing the theme of theodicy in its eschatological terms in comparison to the theological scene of the last judgment.{{citation needed|date=February 2019}} This preference for reading theodicy as an eschatological theme was further affirmed by Harold Bloom in his recurrent phrase of referring to the novel as "The Authentic Apocalyptic Novel."<ref>{{cite web |last= |first=|date=November 28, 2000 |title=Interview with Harold Bloom |url=http://mural.uv.es/jahesa/interbloom.htm |location= |publisher= |accessdate=August 25, 2018 }}</ref>

==Background==
McCarthy wrote ''Blood Meridian'' while living on the money from his 1981 [[MacArthur Fellows Program|MacArthur Fellows]] grant. It is his first novel set in the [[Southwestern United States]], a change from the [[Appalachia]]n settings of his earlier work. In his essay for the ''Slate Book Review'' from 5 October 2012 entitled "Cormac McCarthy Cuts to the Bone", Noah Shannon summarizes the existing library archives of the first drafts of the novel as dating to the mid-1970s. The review includes digital archive images of several of McCarthy's own type-script pages for early versions of the novel.<ref name="shannon">Shannon, Noah (2012-10-05). "Cormac McCarthy Cuts to the Bone". ''Slate Book Review'', 5 October 2012.</ref>

McCarthy conducted considerable research to write the book. Critics have repeatedly demonstrated that even brief and seemingly inconsequential passages of ''Blood Meridian'' rely on historical evidence. The Glanton gang segments are based on [[Samuel Chamberlain]]'s account of the group in his memoir ''My Confession: The Recollections of a Rogue'', which he wrote during the latter part of his life. Chamberlain rode with [[John Joel Glanton]] and his company between 1849 and 1850. The novel's antagonist Judge Holden appeared in Chamberlain's account, but his true identity remains a mystery. Chamberlain does not appear in the novel.

===Style===
McCarthy told [[Oprah Winfrey]] in an interview that he prefers "simple declarative sentences" and that he uses capital letters, periods, an occasional comma, a colon for setting off a list, but never semicolons.<ref>{{cite book|first=Kenneth|last=Lincoln|title=Cormac McCarthy|location=Basingstoke|publisher=Palgrave Macmillan|year=2009|isbn=978-0230619678|page=14}}</ref> He does not use quotation marks for dialogue and believes there is no reason to "blot the page up with weird little marks".<ref>{{cite book|first=David|last=Crystal|title=Making a Point: The Pernickity Story of English Punctuation|year=2015|publisher=Profile Book|location=London|isbn=978-1781253502|page=92}}</ref> Describing events of extreme violence, McCarthy's prose is sparse, yet expansive, with an often [[Bible|biblical]] quality and frequent religious references. McCarthy's writing style involves many unusual or archaic words, no [[quotation mark]]s for [[dialogue]], and no [[apostrophe]]s to signal most contractions.

==Reception==

While ''Blood Meridian'' initially received little recognition, it has since been recognized as McCarthy's masterpiece, and one of the [[Great American Novel|greatest works of American literature]]. American literary critic Harold Bloom praised ''Blood Meridian'' as one of the 20th century's finest novels.<ref>{{Cite web | title=Bloom on "Blood Meridian" | url=http://www.cormacmccarthy.com/works/bloodmeridian.htm | deadurl=yes | archiveurl=https://web.archive.org/web/20060324165326/http://www.cormacmccarthy.com/works/bloodmeridian.htm | archivedate=2006-03-24 | df= }}</ref> [[Time (magazine)|''Time'']] magazine included the novel in its "TIME 100 Best English-language Novels from 1923 to 2005".<ref>{{Cite news| url=http://www.time.com/time/2005/100books/the_complete_list.html | work=Time | title=All Time 100 Novels | accessdate=April 26, 2010 | date=2005-10-16}}</ref>

[[Aleksandar Hemon]] has called ''Blood Meridian'' "possibly the greatest American novel of the past 25 years."  In 2006, ''The New York Times'' conducted a poll of writers and critics regarding the most important works in American fiction from the previous 25 years; ''Blood Meridian'' was a runner-up, along with [[John Updike]]'s four novels about [[Rabbit Angstrom]] and [[Don DeLillo]]'s ''[[Underworld (DeLillo novel)|Underworld]]'' while [[Toni Morrison]]'s ''[[Beloved (novel)|Beloved]]'' topped the list.<ref>''New York Times, Sunday Magazine'', May 21, 2006, p. 16.</ref> Novelist [[David Foster Wallace]] named ''Blood Meridian'' one of the five most underappreciated American novels since 1960<ref>{{cite web|last=Wallace|first=David Foster|title=Overlooked|url=http://www.salon.com/1999/04/12/wallace/|publisher=Salon|accessdate=2014-04-16}}</ref> and described it as "[p]robably the most horrifying book of this century, at least [in] fiction."<ref>{{cite web|title=Gus Van Sant Interviews David Foster Wallace|url=http://www.electriccereal.com/gus-van-sant-interviews-david-foster-wallace/|accessdate=2014-04-16}}</ref>

==Literary significance==

Academics and critics have variously suggested that ''Blood Meridian'' is [[Nihilism|nihilistic]] or strongly [[morality|moral]]; a [[satire]] of the western genre, a savage indictment of [[Manifest Destiny]]. [[Harold Bloom]] called it "the ultimate western;" J. Douglas Canfield described it as "a [[grotesque]] ''[[Bildungsroman]]'' in which we are denied access to the protagonist's consciousness almost entirely."<ref>Canfield, p. 37.</ref> Comparisons have been made to the work of [[Hieronymus Bosch]] and [[Sam Peckinpah]], and of [[Dante Alighieri]] and [[Louis L'Amour]]. However, there is no consensus interpretation; James D. Lilley writes that the work "seems designed to elude interpretation."<ref name="Lilley, p. 19"/> After reading ''Blood Meridian,'' Richard Selzer declared that McCarthy "is a genius--also probably somewhat insane."<ref>Owens, p. 9.</ref> Critic [[Steven Shaviro]] wrote:

{{quote|In the entire range of [[American literature]], only ''[[Moby-Dick]]'' bears comparison to ''Blood Meridian.'' Both are [[Epic poetry|epic]] in scope, cosmically resonant, obsessed with open space and with language, exploring vast uncharted distances with a fanatically patient minuteness. Both manifest a sublime visionary power that is matched only by still more ferocious [[irony]]. Both savagely explode the American dream of [[manifest destiny]] [''sic''] of racial domination and endless imperial expansion. But if anything, McCarthy writes with a yet more terrible clarity than does Melville.|Steven Shaviro|"A Reading of ''Blood Meridian''"<ref>Shaviro, pp. 111–112.</ref>}}

==Attempted film adaptations==
There have been a number of attempts to create a motion picture adaptation of ''Blood Meridian''. However, all have failed during the development or [[pre-production]] stages. A common perception is that the story is "unfilmable", due to its unrelenting violence and dark tone. In an interview with Cormac McCarthy by ''[[The Wall Street Journal]]'' in 2009, McCarthy denied this notion, with his perspective being that it would be "very difficult to do and would require someone with a bountiful imagination and a lot of balls. But the payoff could be extraordinary."<ref>{{cite web | last = John | first = Jurgensen | url = https://www.wsj.com/articles/SB10001424052748704576204574529703577274572 | title = Cormac McCarthy | publisher = ''[[The Wall Street Journal]]'' | date = November 20, 2009 | accessdate = May 21, 2016}}</ref>

Screenwriter [[Steve Tesich]] first adapted ''Blood Meridian'' into a screenplay in 1995. In the late 1990s, [[Tommy Lee Jones]] acquired the film adaptation rights to the story and subsequently rewrote Tesich's screenplay, with the idea of directing and playing a role in it.<ref>{{cite web | last = Balchack | first = Brian | url = http://movieweb.com/william-monahan-to-adapt-blood-meridian/ | title = William Monahan to adapt Blood Meridian | publisher = [[MovieWeb]] | date = May 9, 2014 | accessdate = May 21, 2016}}</ref> Due to film studios avoiding the project's overall violence, production could not move forward. <ref name="FrancoColumn">{{cite web | author = [[James Franco|Franco, James]] | url = https://www.vice.com/en_uk/read/adapting-blood-meridian | title = Adapting 'Blood Meridian' | publisher = ''[[Vice (magazine)|Vice]]'' | date = July 6, 2014 | accessdate = May 21, 2016}}</ref>

Following the end of production for ''[[Kingdom of Heaven (film)|Kingdom of Heaven]]'' in 2004, screenwriter [[William Monahan]] and director [[Ridley Scott]] entered discussions with producer [[Scott Rudin]] for adapting ''Blood Meridian'' with [[Paramount Pictures]] financing.<ref>{{cite web | author = Stax | url = http://www.ign.com/articles/2004/05/10/ridley-onboard-blood-meridian | title = Ridley Scott Onboard Blood Meridian? | publisher = [[IGN]] | date = May 10, 2004 | accessdate = May 21, 2016}}</ref> In an interview with ''[[Eclipse Magazine]]'' published in June 2008, Scott confirmed that the screenplay had been written, but that the extensive violence was proving to be a challenge for film standards.<ref>{{cite web | last = Essman | first = Scott | url = http://eclipsemagazine.com/hollywood-insider/interview-the-great-ridley-scott-speaks-with-eclipse-by-scott-essman/5812 | title = INTERVIEW: The great Ridley Scott Speaks with Eclipse by Scott Essman | publisher = ''Eclipse Magazine'' | date = June 3, 2008 | archiveurl = https://web.archive.org/web/20080604172245/http://eclipsemagazine.com/hollywood-insider/interview-the-great-ridley-scott-speaks-with-eclipse-by-scott-essman/5812 | archivedate = June 4, 2008 | accessdate = May 21, 2016}}</ref> This later led to Scott and Monhan leaving the project, resulting in another abandoned adaptation.<ref>{{cite web | last = Horn | first = John | url = http://articles.latimes.com/2008/aug/17/entertainment/ca-road17? | title = Cormac McCarthy's 'The Road' comes to the screen | publisher = ''[[Los Angeles Times]]'' | date = August 17, 2008 | archiveurl = https://web.archive.org/web/20090615071052/http://articles.latimes.com/2008/aug/17/entertainment/ca-road17 | archivedate = June 15, 2009 | accessdate = May 21, 2016 | deadurl = yes | df =  }}</ref>

By early 2011, [[James Franco]] was thinking of adapting ''Blood Meridian'', along with a number of other [[William Faulkner]] and Cormac McCarthy novels.<ref>{{cite web | author = [[Roger Friedman|Friendman, Roger]] | url = http://www.showbiz411.com/2011/01/03/exclusive-james-franco-planning-to-direct-faulkner-cormac-mccarthy-classics | title = Exclusive: James Franco Planning to Direct Faulkner, Cormac McCarthy Classics | publisher = [[Showbiz411]] | date = January 3, 2011 | accessdate = May 22, 2016}}</ref> After being persuaded by [[Andrew Dominik]] to adapt the novel, Franco shot twenty-five minutes of test footage, starring [[Scott Glenn]], [[Mark Pellegrino]], [[Luke Perry]] and [[Dave Franco]]. For undisclosed reasons, Rudin denied further production of the film.<ref name="FrancoColumn"/> On May 5, 2016, ''[[Variety (magazine)|Variety]]'' revealed that Franco was negotiating with Rudin to write and direct an adaptation to be brought to the [[Marché du Film]], with [[Russell Crowe]], [[Tye Sheridan]] and [[Vincent D'Onofrio]] starring. However, later that day, it was reported that the project dissolved, due to issues concerning the film rights.<ref>{{cite web | last = Kroll | first = Justin | url = https://variety.com/2016/film/news/russell-crowe-james-franco-blood-meridian-1201767424/ | title = Russell Crowe in Talks to Star in James Franco-Directed ‘Blood Meridian’ | date = May 5, 2016 | publisher = ''[[Variety (magazine)|Variety]]'' | accessdate = May 22, 2016}}</ref>

[[Lynne Ramsay]] has expressed an interest in adapting the novel.<ref>{{Cite web|url=https://www.reddit.com/r/movies/comments/8a345x/im_lynne_ramsay_writer_and_director_of_you_were/dwvnhzi/|title=r/movies - I’m Lynne Ramsay, writer and director of You Were Never Really Here. AMA, r/movies!|website=reddit|language=en|access-date=2018-11-07}}</ref>

==Notes==
{{Reflist|30em}}

==References==
* {{cite book |last=Canfield |first=J. Douglas |title=Mavericks on the Border: Early Southwest in Historical fiction and Film |publisher=University Press of Kentucky |year=2001 |isbn=0-8131-2180-9 }}
* {{cite journal |last=Daugherty |first=Leo |title=Gravers False and True: Blood Meridian as Gnostic Tragedy |journal=Southern Quarterly |volume=30 |issue=4 |year=1992 |pages=122–133 }}
* {{cite book |last=Lilley |first=James D. |chapter=History and the Ugly Facts of ''Blood Meridian'' |title=Cormac McCarthy: New Directions |publisher=University of New Mexico Press |location=Albuquerque |year=2014 |isbn=978-0-8263-2767-3 }}
* {{cite book |last=Owens |first=Barcley |title=Cormac McCarthy's Western Novels |publisher=University of Arizona Press |year=2000 |isbn=0-8165-1928-5 }}
* {{cite book |first=Christoph |last=Schneider |chapter=Pastorale Hoffnungslosigkeit. Cormac McCarthy und das Böse |editor-first=Natalia |editor-last=Borissova |editor2-first=Susi K. |editor2-last=Frank |editor3-first=Andreas |editor3-last=Kraft |title=Zwischen Apokalypse und Alltag. Kriegsnarrative des 20. und 21. Jahrhunderts |location=Bielefeld |year=2009 |pages=171–200 }}
* {{cite journal |last=Shaviro |first=Steven |title=A Reading of ''Blood Meridian'' |journal=Southern Quarterly |volume=30 |issue=4 |year=1992 |pages= }}
* {{cite journal |last=Shaw |first=Patrick W. |title=The Kid's Fate, the Judge's Guilt: Ramifications of Closure in Cormac McCarthy's ''Blood Meridian'' |journal=Southern Literary Journal |year=1997 |pages=102–119 }}
* {{cite journal |last=Stratton |first=Billy J. |title=‘el brujo es un coyote’: Taxonomies of Trauma in Cormac McCarthy's Blood Meridian |journal=Arizona Quarterly: A Journal of American Literature, Culture, and Theory |volume=67 |issue=3 |year=2011 |pages=151–172 |doi=10.1353/arq.2011.0020 }}

==Further reading==
* {{cite book |title=Notes on Blood Meridian |edition=Revised and Expanded |first=John |last=Sepich |others=Foreword by Edwin T. Arnold |series=Southwestern Writers Collection Series |publisher=University of Texas Press |year=2008 |isbn=978-0-292-71821-0 |url=http://www.thewittliffcollections.txstate.edu/book-series/notesonblood.html }}

==External links==
{{Wikiquote}}
* [https://www.nytimes.com/1985/04/28/books/mccarthy-meridian.html James, C., Blood Meridian by Cormac McCarthy, ''The New York Times'', Apr 1985]
* [http://www.thenewcanon.com/Blood_Meridian.html ''Blood Meridian'' by Cormac McCarthy], reviewed by Ted Gioia ([http://www.thenewcanon.com  The New Canon])
* [https://www.npr.org/templates/story/story.php?storyId=99347082 NPR interview with Ben Nichols about his record ''The Last Pale Light in the West'', inspired by ''Blood Meridian'']

{{Cormac McCarthy}}

[[Category:1985 American novels]]
[[Category:Novels by Cormac McCarthy]]
[[Category:American bildungsromans]]
[[Category:American historical novels]]
[[Category:Western (genre) novels]]
[[Category:Novels set in Texas]]
[[Category:Novels set in Mexico]]
[[Category:Novels set in Arizona]]
[[Category:Novels set in California]]
[[Category:Fiction set in 1849]]
[[Category:Fiction set in 1850]]
[[Category:Fiction set in 1878]]`;

export const alternateTestWikitext = `{{short description|American novelist, playwright, and screenwriter}}
{{About|the American author}}
{{Use mdy dates|date=July 2017}}
{{Infobox writer
| name         = Cormac McCarthy
| birth_name   = Charles McCarthy
| birth_date   = {{Birth date and age|1933|7|20|mf=y}}
| birth_place  = [[Providence, Rhode Island]], U.S.
| occupation   = Novelist, playwright, screenwriter
| nationality  = American
| genre        = [[Southern gothic]], [[Western fiction|western]], [[Apocalyptic and post-apocalyptic fiction|post-apocalyptic]]
| notableworks = ''[[Suttree]]'' (1979)<br>''[[Blood Meridian]]'' (1985)<br>''[[All the Pretty Horses (novel)|All the Pretty Horses]]'' (1992)<br>''[[No Country for Old Men]]'' (2005)<br>''[[The Road]]'' (2006)
| spouse       = {{Marriage|Lee Holleman|1961|1962|reason=divorced}}<br />{{Marriage|Annie DeLisle|1967|1981|reason=divorced}}<br />{{Marriage|Jennifer Winkley|1997|2006|reason=divorced}}
| children     = Cullen McCarthy, son, {{abbr|b.|born}} 1962 (with Lee Holleman)<br />
John McCarthy, son, {{abbr|b.|born}} 1998 (with Jennifer Winkley)
| signature    = Cormac McCarthy signature.svg
| website      = {{URL|http://randomhouse.com/kvpa/cormacmccarthy/}}
}}

'''Cormac McCarthy''' (born '''Charles McCarthy''';<ref name=newmillenniumwritings>{{cite news| author = Don Williams| title = Cormac McCarthy Crosses the Great Divide| url = http://newmillenniumwritings.com/Issue14/CormacMcCarthy.html| publisher = [[New Millennium Writings]]| access-date = February 8, 2016| archive-url = https://web.archive.org/web/20160303171328/http://newmillenniumwritings.com/Issue14/CormacMcCarthy.html| archive-date = March 3, 2016| dead-url = yes| df = mdy-all}}</ref> July 20, 1933) is an American novelist, playwright, and screenwriter. He has written ten novels, spanning the [[Southern Gothic]], [[Western fiction|Western]], and [[Apocalyptic and post-apocalyptic fiction|post-apocalyptic]] genres.

McCarthy's fifth novel, ''[[Blood Meridian]]'' (1985), was on ''[[Time (magazine)|Time]]'' magazine's 2005 list of the 100 best English-language books published since 1923.<ref name="Time Magazine 2005" >{{cite news | author = Lev Grossman and Richard Lacayo| title = All Time 100 Novels – The Complete List| url = http://www.time.com/time/2005/100books/the_complete_list.html|magazine= [[Time (magazine)|Time]]| date=October 16, 2005| accessdate =June 3, 2008}}</ref>

For ''[[All the Pretty Horses (novel)|All the Pretty Horses]]'' (1992), he won both the [[National Book Award]]<ref name=nba1992/> and [[National Book Critics Circle Award]]. His 2005 novel ''[[No Country for Old Men]]'' was adapted as a 2007 [[No Country for Old Men (film)|film of the same name]], which won four [[Academy Awards]], including [[Academy Award for Best Picture|Best Picture]].<ref>{{cite news|url=https://www.npr.org/templates/story/story.php?storyId=19325798|title='No Country for Old Men' Wins Four Oscars|publisher=NPR|date=February 25, 2008|accessdate=July 15, 2017}}</ref> ''All the Pretty Horses'', ''[[The Road]]'', and ''[[Child of God]]'' have also been [[film adaptation|adapted as motion pictures]],<ref>{{cite news|url=https://www.theguardian.com/film/2014/jul/31/child-of-god-review-james-franco-cormac-mccarthy|title=Child of God review – James Franco misfires with this punishing thriller|first=Jordan|last=Hoffman|work=The Guardian|date=July 31, 2014|accessdate=July 15, 2017}}</ref> while ''[[Outer Dark]]'' was turned into a 15-minute short.

McCarthy won the 2007 [[Pulitzer Prize]]<ref name=pulitzer/> and the [[James Tait Black Memorial Prize]] for Fiction for ''[[The Road]]'' (2006).<ref>{{cite web |last1=Mccarthy |first1=Cormacmes |title=Winner of James Tait Black Award . |url=https://www.ed.ac.uk/events/james-tait-black/winners/fiction |website=James Tait Black |accessdate=27 August 2018}}</ref> In 2010, ''[[The Times]]'' ranked ''The Road'' first on its list of the 100 best fiction and non-fiction books of the past 10 years. Literary critic [[Harold Bloom]] named McCarthy as one of the four major American novelists of his time, alongside [[Don DeLillo]], [[Thomas Pynchon]] and [[Philip Roth]],<ref name= bloom >{{cite news|url=http://www.boston.com/news/globe/editorial_opinion/oped/articles/2003/09/24/dumbing_down_american_readers/|title=Dumbing down American readers|last=Bloom|first=Harold|work=Boston Globe|date=September 24, 2003|accessdate=December 4, 2009}}</ref> and called ''Blood Meridian''  "the greatest single book since [[William Faulkner|Faulkner]]'s ''[[As I Lay Dying (novel)|As I Lay Dying]]''".<ref name= bloommeridian >{{cite news|url=http://www.avclub.com/articles/harold-bloom-on-blood-meridian,29214/|title=Harold Bloom on ''Blood Meridian''|last=Bloom|first=Harold|work=A.V. Club|date=June 15, 2009|accessdate=March 3, 2010}}</ref>

==Writing career==
[[Random House]]  published McCarthy's first novel, ''[[The Orchard Keeper]]'', in 1965. McCarthy decided to send the manuscript to Random House because "it was the only publisher [he] had heard of". At Random House, the manuscript found its way to Albert Erskine, who had been [[William Faulkner]]'s editor until Faulkner's death in 1962.<ref>{{cite news|url=http://www.oxfordreference.com/views/ENTRY.html?subview=Main&entry=t197.e0180 |title=The Oxford Encyclopedia of American Literature: McCarthy, Cormac &#124; Books &#124; |publisher=Oxford University Press |year= 2004 |accessdate=October 25, 2011| location=New York | first=Kimberly | last=Lewis}}</ref> Erskine continued to edit McCarthy's work for the next 20 years.

In the summer of 1965, using a Traveling Fellowship award from [[The American Academy of Arts and Letters]], McCarthy shipped out aboard the liner ''Sylvania'' hoping to visit Ireland. While on the ship, he met Anne DeLisle, who was working on the '' Sylvania'' as a singer. In 1966, they were married in England. Also in 1966, McCarthy received a [[Rockefeller Foundation]] Grant, which he used to travel around [[Southern Europe]] before landing in [[Ibiza]], where he wrote his second novel, ''[[Outer Dark]]'' (1968). Afterward he returned to America with his wife, and ''Outer Dark'' was published to generally favorable reviews.<ref name=persp>{{cite book|last=Arnold|first=Edwin|title=Perspectives on Cormac McCarthy|publisher=[[University Press of Mississippi]]|year=1999|isbn=1-57806-105-9}}</ref>

In 1969, the couple moved to [[Louisville, Tennessee]], and purchased a barn, which McCarthy renovated, doing the stonework himself.<ref name= persp/> Here he wrote his next book, ''[[Child of God]]'' (1973), based on actual events. Like ''Outer Dark'' before it, ''Child of God'' was set in southern [[Appalachia]]. In 1976, McCarthy separated from Anne DeLisle and moved to [[El Paso, Texas]]. In 1979, his novel ''[[Suttree]]'', which he had been writing on and off for 20 years,<ref name= nytint/> was finally published.{{citation needed|date=July 2017}}

Supporting himself with the money from his 1981 [[MacArthur Fellows Program|MacArthur Fellowship]], McCarthy wrote his next novel, ''[[Blood Meridian|Blood Meridian, or the Evening Redness in the West]]'' (1985). The book has grown appreciably in stature in literary circles; in a 2006 poll of authors and publishers conducted by ''The New York Times Magazine'' to list the greatest American novels of the previous quarter-century, ''Blood Meridian'' placed third, behind only [[Toni Morrison]]'s ''[[Beloved (novel)|Beloved]]'' (1987) and [[Don DeLillo]]'s ''[[Underworld (DeLillo novel)|Underworld]]'' (1997).<ref name="New York Times 2006" >{{cite news|title=What Is the Best Work of American Fiction of the Last 25 Years?|url=https://www.nytimes.com/2006/05/21/books/fiction-25-years.html|newspaper=[[The New York Times]]|date=May 21, 2006|accessdate=April 30, 2010}}</ref>

In 1992, an article in ''The New York Times'' noted that none of McCarthy's novels published to that point had sold more than 5,000 hardcover copies, and that "for most of his career, he did not even have an agent".<ref>{{cite news|url=https://www.nytimes.com/books/98/05/17/specials/mccarthy-venom.html|title=Cormac McCarthy's Venomous Fiction|first=Richard B.|last=Woodward|newspaper=[[The New York Times]]|date=April 19, 1992|accessdate=May 25, 2015}}</ref>

McCarthy finally received widespread recognition after the publication of ''[[All the Pretty Horses (novel)|All the Pretty Horses]]'' (1992), when it won the National Book Award<ref name=nba1992/><ref>{{cite book|chapter=History and the Ugly Facts of ''Blood Meridian''|first=Dana|last=Phillips|editor-first=James D.|editor-last=Lilley|title=Cormac McCarthy: New Directions|year=2014|location=Albuquerque, NM|publisher=University of New Mexico Press|pages=17–46}}</ref> and the National Book Critics Circle Award. It was followed by ''[[The Crossing (McCarthy novel)|The Crossing]]'' (1994) and ''[[Cities of the Plain (novel)|Cities of the Plain]]'' (1998), completing the [[Border Trilogy]]. In the midst of this trilogy came, c. 1994, ''[[The Stonemason]]''<ref>{{cite web|title=The Stonemason|url=http://search.lib.unc.edu/search?R=UNCb2617550|website=UNC-Chapel Hill Library catalog|publisher=University of North Carolina at Chapel Hill|accessdate=January 31, 2017}}</ref> (first performed in 1995), McCarthy's second dramatic work. He had previously written a film for [[PBS]],'' [[The Gardener's Son]]'', which aired January 6, 1977.{{citation needed|date=July 2017}}

McCarthy's next book, ''[[No Country for Old Men]]'' (2005), was originally conceived as a screenplay before being turned into a novel. It stayed with the Western setting and themes yet moved to a more contemporary period. The [[Coen brothers]] adapted it into a 2007 [[No Country for Old Men (film)|film of the same name]],  which won four [[Academy Awards]] and more than 75 film awards globally. McCarthy's next book, ''[[The Road]]'' (2006), won international acclaim and the [[Pulitzer Prize for Fiction]];<ref name=pulitzer/> a 2009 [[The Road (2009 film)|film adaptation]] was directed by [[John Hillcoat]], written by [[Joe Penhall]], and starred [[Viggo Mortensen]] and [[Kodi Smit-McPhee]]. Also in 2006, McCarthy published the play ''[[The Sunset Limited]]''; he adapted it as a screenplay for an [[HBO]] film (airdate February 2011). It was directed and executive produced by [[Tommy Lee Jones]], who also starred opposite [[Samuel L. Jackson]].

In 2012, McCarthy sold his original screenplay ''[[The Counselor]]'' to [[Nick Wechsler (producer)|Nick Wechsler]], Paula Mae Schwartz, and Steve Schwartz, who had previously produced the film adaptation of McCarthy's novel ''[[The Road (2009 film)|The Road]]''.<ref>{{cite news|url= http://www.thewrap.com/deal-central/column-post/no-country-old-men-novelist-cormac-mccarthy-sells-first-spec-script-34512 |title=Cormac McCarthy Sells First Spec Script |work=TheWrap}}</ref> [[Ridley Scott]] directed, and the cast included [[Brad Pitt]], [[Michael Fassbender]], [[Penélope Cruz]], [[Javier Bardem]], and [[Cameron Diaz]].  Production finished in 2012, and it was released on October 25, 2013, to polarized critical reception.{{citation needed|date=February 2015}}

In a 2017 essay titled "The Kekulé Problem", McCarthy analyzed a dream of [[August Kekulé]]'s as a model of the [[unconscious mind]] and the [[liguistics|origins of language]].<ref>{{cite web|url=http://nautil.us/issue/47/consciousness/the-kekul-problem|title=The Kekulé Problem|date=April 20, 2017|accessdate=July 4, 2018}}</ref> Kekulé claimed to have discovered the ring-like shape of a [[benzene]] molecule after dreaming of an "[[ouroboros]]".

===Current projects===
''The Guardian'' reported in 2009 that McCarthy was at work on three new novels.<ref>{{cite news|url=https://www.theguardian.com/books/2009/may/18/cormac-mccarthy-archive-texas|title=Cormac McCarthy archive goes on display in Texas|publisher=Guardian|date=May 18, 2009|accessdate=January 11, 2010|location=London, UK|first=Alison|last=Flood}}</ref> One is set in 1980s [[New Orleans]] and follows a young man as he deals with the suicide of his sister. According to McCarthy, this will feature a prominent female character. He also states that the new novel is "long".<ref>{{cite news|last=Jurgensen|first=John|url=https://www.wsj.com/articles/SB10001424052748704576204574529703577274572|title=Cormac McCarthy on The Road|publisher=Online.wsj.com|date=November 20, 2009|accessdate=January 11, 2010}}</ref>

===Archives===
The comprehensive archive of McCarthy's personal papers is preserved at the [[Wittliff collections]], [[Texas State University]], San Marcos, Texas. The McCarthy papers consists of 98 boxes (46 linear feet).<ref name="alek">[http://www.thewittliffcollections.txstate.edu/research/a-z/mccarthy.html Cormac McCarthy Papers at The Wittliff Collections, Texas State University, San Marcos, TX]</ref> The acquisition of the Cormac McCarthy Papers resulted from years of ongoing conversations between McCarthy and Southwestern Writers Collection founder, [[Bill Wittliff]], who negotiated the proceedings.<ref>{{cite news|url=http://www.hollywoodreporter.com/news/texas-state-acquires-mccarthy-archives-102545|title=Texas State acquires McCarthy archives|agency=Associated Press|work=The Hollywood Reporter|date=January 15, 2008|accessdate=July 15, 2017}}</ref>

The Southwestern Writers Collection/[[Wittliff collections]] also holds The Wolmer Collection of Cormac McCarthy, which consists of letters between McCarthy and bibliographer J. Howard Woolmer,<ref name="Wittliff">{{cite web|url=http://www.thewittliffcollections.txstate.edu/research/a-z/woolmer.html|title=Woolmer Collection of Cormac McCarthy : The Wittliff Collections : Texas State University|date=September 21, 2016|website=Thewittliffcollections.txstate.edu|accessdate=November 29, 2017}}</ref> and four other related collections.<ref name="Wittliff"/>

===Spanish dialogue in McCarthy's Western novels===
In "Mojado Reverso; or, a Reverse Wetback: On John Grady Cole's Mexican Ancestry in ''All the Pretty Horses''," Jeffrey Herlihy-Mera observes: "John Grady Cole is a native speaker of Spanish. This is also the case of several other important characters in the Border Trilogy, including Billy Parhnam (sic), John Grady's mother (and possibly his grandfather and brothers), and perhaps Jimmy Blevins, each of whom are speakers of Spanish who were ostensibly born in the US political space into families with what are generally considered English-speaking surnames…This is also the case of Judge Holden in ''Blood Meridian''."<ref name="academia.edu">Herlihy-Mera, Jeffrey. "[https://www.academia.edu/16839513/_Mojado-Reverso_or_a_Reverse_Wetback_On_John_Grady_Cole_s_Mexican_Ancestry_in_Cormac_McCarthy_s_All_the_Pretty_Horses Mojado Reverso; or, A Reverse Wetback: On John Grady Cole's Mexican Ancestry in ''All the Pretty Horses''"], ''Modern Fiction Studies'', Fall 2015; retrieved March 25, 2016.</ref><ref name="muse.jhu.edu">Herlihy-Mera, Jeffrey. [https://muse.jhu.edu/login?auth=0&type=summary&url=/journals/modern_fiction_studies/v061/61.3.herlihy-mera.pdf Mojado Reverso; or, A Reverse Wetback: On John Grady Cole's Mexican Ancestry in ''All the Pretty Horses''"], ''Modern Fiction Studies'', Fall 2015; retrieved October 15, 2015.</ref>

The Cormac McCarthy Society has made [[PDF]] documents comprising Spanish-to-English translations of dialogue for four of McCarthy's Western novels:  ''Blood Meridian'', ''All the Pretty Horses'', ''The Crossing'', and ''Cities of the Plain''.<ref>{{cite web|url=http://cormacmccarthy.cookingwithmarty.com/wp-content/uploads/BMTrans.pdf|website=Cormac McCarthy|title=A Translation of the Spanish in ''Blood Meridian''|accessdate=July 14, 2017}}</ref><ref>{{cite web|url=http://cormacmccarthy.cookingwithmarty.com/wp-content/uploads/CrossingTrans.pdf|website=Cormac McCarthy|title=A Translation of Spanish Passages in ''The Crossing''|author=Campbell, Lt. Jim|accessdate=July 14, 2017}}</ref><ref>{{cite web|author=Stevens, Brent|url=http://cormacmccarthy.cookingwithmarty.com/wp-content/uploads/ATPHTrans.pdf#page=1&zoom=auto,-169,792|title=A Translation of the Spanish Passages in ''All the Pretty Horses''|website=CormacMcCarthy.com|accessdate=July 14, 2017}}</ref><ref>{{cite web|url= http://cormacmccarthy.cookingwithmarty.com/wp-content/uploads/COTPTrans.pdf|website=Cormac McCarthy|title=A Translation of the Spanish in ''Cities of the Plain''|accessdate=July 14, 2017}}</ref>

==Writing style==
McCarthy makes sparse use of punctuation,<ref>{{cite web|url=http://www.openculture.com/2013/08/cormac-mccarthys-punctuation-rules.html|title=Cormac McCarthy's Three Punctuation Rules, and How They All Go Back to James Joyce|first=Josh|last=Jones|publisher=Open Culture|date=August 13, 2013|accessdate=September 13, 2015}}</ref> even replacing most commas with "and" (a [[polysyndeton]]). He told [[Oprah Winfrey]] in an interview that he prefers "simple declarative sentences" and that he uses capital letters, periods, an occasional comma, a colon for setting off a list, but never semicolons.<ref>{{cite book|first=Kenneth|last=Lincoln|title=Cormac McCarthy|location=Basingstoke|publisher=Palgrave Macmillan|year=2009|isbn=978-0230619678|page=14}}</ref> He does not use quotation marks for dialogue and believes there is no reason to "blot the page up with weird little marks".<ref>{{cite book|first=David|last=Crystal|title=Making a Point: The Pernickity Story of English Punctuation|year=2015|publisher=Profile Book|location=London|isbn=978-1781253502|page=92}}</ref> [[Erik Hage]] notes that McCarthy's dialogue also often lacks attribution, but that "[s]omehow...the reader remains oriented as to who is speaking".<ref>{{cite book|first=Erik|last=Hage|title=Cormac McCarthy: A Literary Companion|location=Jefferson, NC|publisher=McFarland & Company|year=2010|isbn=978-0786443109|page=156}}</ref> His attitude to punctuation dates to some editing work he did for a professor of English while he was enrolled at the University of Tennessee, when he stripped out much of the punctuation in the book being edited, which pleased the professor.<ref>{{cite book|first=Willard P.|last=Greenwood|title=Reading Cormac McCarthy|year=2009|location=Santa Barbara, CA|publisher=ABC-CLIO|isbn=978-0313356643|page=4}}</ref> McCarthy also edited fellow Santa Fe Institute Fellow [[W. Brian Arthur]]'s influential article "Increasing Returns and the New World of Business", published in the ''[[Harvard Business Review]]'' in 1996, removing commas from the text.<ref>{{cite news|url=https://www.fastcompany.com/3064681/most-creative-people/most-important-economic-theory-in-technology-brian-Arthur|title=A Short History Of The Most Important Economic Theory In Tech|first=Rick|last=Tetzeli|publisher=Fast Company|date=December 7, 2016|accessdate=July 15, 2017}}</ref> He has also done copy-editing work for physicists [[Lawrence M. Krauss]] and [[Lisa Randall]].<ref>{{cite news|url=https://www.theguardian.com/books/2012/feb/21/cormac-mccarthy-scientific-copy-editor|title=Cormac McCarthy's parallel career revealed – as a scientific copy editor!|first=Alison|last=Flood|work=The Guardian|date=February 21, 2012|accessdate=July 15, 2017}}</ref>

==Inspiration==
In one of his few interviews (with ''The New York Times''), McCarthy revealed that he respects only authors who "deal with issues of life and death," citing [[Henry James]] and [[Marcel Proust]] as examples of writers who do not rate with him. "I don't understand them ... To me, that's not literature. A lot of writers who are considered good I consider strange", he said.<ref name= nytint/>

[[Oprah Winfrey]] selected McCarthy's 2006 novel ''[[The Road]]'' as the April 2007 selection for her [[Oprah's Book Club|Book Club]].<ref name= oprahbookclub >{{cite news|title=Your Reader's Guide to The Road|url=http://www.oprah.com/article/oprahsbookclub/road/road_book_synopsis| publisher=Oprah.com}}</ref> As a result, McCarthy agreed to his first television interview, which aired on ''[[The Oprah Winfrey Show]]'' on June 5, 2007. The interview took place in the library of the Santa Fe Institute. McCarthy told Winfrey that he does not know any writers and much prefers the company of scientists. During the interview, he related several stories illustrating the degree of outright poverty he endured at times during his career as a writer. He also spoke about the experience of fathering a child at an advanced age, and how his son was the inspiration for ''The Road''.{{citation needed|date=July 2017}}

Regarding his own literary constraints when writing novels, McCarthy said he is "not a fan of some of the Latin American writers, [[magical realism]]. You know, it's hard enough to get people to believe what you're telling them without making it impossible. It has to be vaguely plausible."<ref>{{cite news|url=http://www.time.com/time/magazine/article/0,9171,1673269-2,00.html|title=A conversation between author Cormac McCarthy and the Coen Brothers, about the new movie No Country for Old Men|website=Time.com|date=October 18, 2007}}</ref>

As reported in ''[[Wired (magazine)|Wired]]'' magazine, McCarthy's [[Olivetti Lettera 32]] typewriter, which he had owned since buying it in a Knoxville pawnshop for $50 in 1963, was put up for auction at [[Christie's]] in 2009. He estimates he has typed around five million words on the machine, and maintenance consisted of "blowing out the dust with a service station hose". The Olivetti was auctioned on December 4, 2009, and the auction house estimated it would fetch between $15,000 and $20,000; it sold for $254,500.<ref>{{cite news|last=Kennedy|first=Randy|url=http://artsbeat.blogs.nytimes.com/2009/12/04/cormac-mccarthys-typewriter-brings-254500-at-auction|title=Cormac McCarthy's Typewriter Brings $254,500 at Auction|publisher=Artsbeat.blogs.nytimes.com|date=December 4, 2009|accessdate=January 11, 2010}}</ref> Its replacement is another Olivetti, bought for McCarthy by his friend John Miller for $11.<ref>{{cite news|url=https://www.wired.com/gadgetlab/2009/12/cormac-mccarthys-typewriter-dies-after-50-years-and-five-million-words|title=Cormac McCarthy's Typewriter Dies After 50 Years and 5 Million Words|website=Wired.com|date=December 2, 2009|accessdate=January 11, 2010|first=Charlie|last=Sorrel}}</ref>

==Personal life==
McCarthy was born in [[Providence, Rhode Island]], one of six children of Charles Joseph McCarthy and Gladys Christina (née McGrail) McCarthy.<ref name=kns1>Fred Brown, "[http://www.knoxnews.com/news/2009/jan/29/sister-childhood-home-made-writer/ Childhood Home Made Cormac McCarthy]," ''Knoxville News Sentinel'', January 29, 2009; retrieved July 14, 2017.</ref> In 1937, his family relocated to Knoxville, where his father worked as a lawyer for the [[Tennessee Valley Authority]].<ref name=bio>[http://www.cormacmccarthy.com/biography/ Cormac McCarthy: A Biography].  Cormac McCarthy Society official website; retrieved April 27, 2012.</ref>

The family first lived on Noelton Drive in the upscale [[Sequoyah Hills, Tennessee|Sequoyah Hills]] subdivision, but by 1941 had settled in a house on Martin Mill Pike in [[South Knoxville]] (this latter house burned in 2009).<ref>Jack Neely, [https://web.archive.org/web/20130728114947/http://www.metropulse.com/news/2009/feb/03/house-where-i-grew "The House Where I Grew Up"], ''Metro Pulse'', February 3, 2009; accessed October 2, 2015.</ref> Among his childhood friends was Jim Long (1930–2012), who would later be depicted as J-Bone in his novel ''Suttree''.<ref name=jbone>Jack Neely, [https://web.archive.org/web/20131231000123/http://www.metropulse.com/news/2012/sep/19/jim-j-bone-long-1931-2012-one-visit-not-quite-fict/?print=1 Jim "J-Bone" Long, 1930-2012: One Visit With a Not-Quite Fictional Character], ''Metro Pulse'', September 19, 2012; accessed October 2, 2015.</ref>

McCarthy attended St. Mary's Parochial School and [[Knoxville Catholic High School]],<ref>Wesley Morgan, Rich Wallach (ed.), "[https://books.google.com/books?id=Oqyh6snZAB0C&pg=PA89&q=james%20william%20long James William Long]," ''You Would Not Believe What Watches: Suttree and Cormac McCarthy's Knoxville'' (LSU Press, 1 May 2013), p. 59.</ref> and was an [[altar boy]] at Knoxville's [[Church of the Immaculate Conception (Knoxville, Tennessee)|Church of the Immaculate Conception]].<ref name=jbone/> He attended the [[University of Tennessee]] from 1951–52 and 1957–59 but never graduated. While at UT he published two stories in ''The Phoenix'' and was awarded the [[Ingram Merrill Foundation|Ingram Merrill Award]] for creative writing in 1959 and 1960.{{citation needed|date=July 2017}}

For purposes of his writing career, McCarthy decided to change his first name from Charles to Cormac to avoid association with famous ventriloquist [[Edgar Bergen]]'s dummy Charlie McCarthy,<ref>{{cite web|url=https://books.google.com/books?id=QFw722-PbCcC&pg=PT404|title=Irish Catholic Writers and the Invention of the American South|first=Bryan|last=Giemza|date=July 8, 2013|publisher=LSU Press|accessdate=November 29, 2017|via=Google Books}}</ref> changing it to Cormac after famous Irish high kings [[Cormac mac Airt]] and [[Cormac mac Cuilennáin]].<ref>{{cite web|url=https://appellationmountain.net/name-of-the-day-cormac/|title=Name of the Day: Cormac - Appellation Mountain|date=July 30, 2009|website=Appellationmountain.net|accessdate=November 29, 2017}}</ref>

After marrying fellow student Lee Holleman in 1961, they "moved to a shack with no heat and running water in the foothills of the Smoky Mountains outside of Knoxville". There they had a son, Cullen, in 1962. While caring for the baby and tending to the chores of the house, Lee was asked by Cormac to also get a day job so he could focus on his novel writing. Dismayed with the situation, she moved to Wyoming, where she filed for divorce and landed her first job teaching.<ref>{{cite news|title=Obituary: Lee McCarthy|url=http://www.legacy.com/obituaries/bakersfield/obituary.aspx?n=lee-mccarthy&pid=125527543|newspaper=The Bakersfield Californian|date=March 29, 2009}}</ref>{{Copypaste|reason=The last three sentences were copy and pasted from the source|date=April 2019}}

Cormac McCarthy is fluent in Spanish and lived in Ibiza, Spain, in the 1960s and later settled in El Paso, Texas, where he lived for nearly 20 years.<ref name="muse.jhu.edu"/> In an interview with Richard B. Woodward from ''[[The New York Times]]'', "McCarthy doesn't drink anymore – he quit 16 years ago in El Paso, with one of his young girlfriends – and ''Suttree'' reads like a farewell to that life. 'The friends I do have are simply those who quit drinking,' he says. 'If there is an occupational hazard to writing, it's drinking.'".<ref>{{cite news|url=https://www.nytimes.com/books/98/05/17/specials/mccarthy-venom.html|newspaper=[[The New York Times]]|title=The New York Times: Book Review Search Article|date=May 17, 1998}}</ref>

In the late 1990s, McCarthy moved to the [[Tesuque, New Mexico]] area, north of [[Santa Fe, New Mexico|Santa Fe]], with his third wife, Jennifer Winkley, and their son, John. McCarthy and Winkley divorced in 2006.

===Family===
;Children:
* Cullen McCarthy (born 1962), son (with Lee Holleman)<ref name=Holleman>{{cite web|url=http://www.legacy.com/obituaries/bakersfield/obituary.aspx?page=notice&pid=125527543| title=Lee McCarthy Obituary|date=March 29, 2009|publisher=[[The Bakersfield Californian]]| accessdate=January 20, 2011}}</ref>
* John Francis McCarthy (born 1998), son (with Jennifer Winkley)<ref>{{cite news|url=http://archive.knoxnews.com/news/local/cormac-mccarthy-on-the-trail-of-a-legend-ep-412332474-360064991.html/|title=Cormac McCarthy: On the trail of a legend|first=Fred|last=Brown|work=Knoxville News Sentinel|date=December 16, 2007|accessdate=December 9, 2017}}</ref>

;Marriages:
* Lee Holleman, (1961–1962)
* Annie DeLisle, (1967–1981)
* Jennifer Winkley (1997–2006)

==Bibliography==
{{Expand list|date=May 2017}}

===Novels===
* ''[[The Orchard Keeper]]'' (1965) {{ISBN|0-679-72872-4}}
* ''[[Outer Dark]]'' (1968) {{ISBN|0-679-72873-2}}
* ''[[Child of God]]'' (1973) {{ISBN|0-679-72874-0}}
* ''[[Suttree]]'' (1979) {{ISBN|0-679-73632-8}}
* ''[[Blood Meridian|Blood Meridian or the Evening Redness in the West]]'' (1985) {{ISBN|0-679-72875-9}}
* ''[[All the Pretty Horses (novel)|All the Pretty Horses]]'' (1992) {{ISBN|0-679-74439-8}} – [[Border Trilogy]], 1
* ''[[The Crossing (McCarthy novel)|The Crossing]]'' (1994) {{ISBN|0-679-76084-9}} – Border Trilogy, 2
* ''[[Cities of the Plain (novel)|Cities of the Plain]]'' (1998) {{ISBN|0-679-74719-2}} – Border Trilogy, 3
* ''[[No Country for Old Men]]'' (2005) {{ISBN|0-375-70667-4}}
* ''[[The Road]]'' (2006) {{ISBN|0-307-38789-5}}
* ''The Passenger'' (forthcoming)<ref>{{cite web|title=The Cormac McCarthy Papers|url=http://www.thewittliffcollections.txstate.edu/research/a-z/mccarthypapers.html|website=thewittliffcollections.txstate.edu|accessdate=July 14, 2017}}</ref>

===Short fiction===
* "Wake for Susan" (1959)<ref>{{cite news|title=Wake for Susan|work=The Phoenix|origyear= October 1959|pages=3–6|url=http://biblioklept.org/2011/02/02/wake-for-susan-cormac-mccarthy|author=McCormack, McCarthy|date=February 2, 2011|accessdate=July 14, 2017}}</ref>
* "A Drowning Incident" (1960)<ref>{{cite news|title=A Drowning Incident|work=The Phoenix|date=March 1960|pages=3–4|author=McCarthy, Cormac}}</ref>
* "The Dark Waters" (1965)<ref>{{cite news|title=The Dark Waters|work=The Sewanee Review|date= Spring 1965|pages=210–16|jstor=27541110|author=McCarthy, Cormac}}</ref>

===Essays===
* "The Kekulé Problem" (2017)<ref>{{cite news|title=The Kekulé Problem|work=Nautilus|origyear= April 2017|pages=3–6|url=http://nautil.us/issue/47/consciousness/the-kekul-problem|author=McCormack, McCarthy|date=April 17, 2017|accessdate=July 1, 2018}}</ref>

===Screenplays===
* ''[[The Gardener's Son]]'' (1996) {{ISBN|0-88001-481-4}}
* ''[[The Counselor]]'' (2013) {{ISBN|978-1-4472-2764-9}} <ref>{{cite news|work=Collider|url=http://collider.com/cormac-mccarthy-the-counselor/138813|title=Author Cormac McCarthy Sells His First Spec Script THE COUNSELOR|page=138813|accessdate=July 14, 2017}}</ref><ref>{{cite journal |author=McCarthy, Cormac|title=Scenes of the crime|journal=The New Yorker|volume=89|issue=17|pages=66–69|url=http://www.newyorker.com/magazine/2013/06/10/scenes-of-the-crime|date=June 10, 2013|accessdate=July 14, 2017}}</ref>

====Unpublished====
* ''[[The Sunset Limited (film)|The Sunset Limited]]'' (2011)

===Plays===
* ''[[The Stonemason]]'' ([[:Category:1995 plays|1995]]) {{ISBN|978-0-679-76280-5}}
* ''[[The Sunset Limited]]'' ([[:Category:2006 plays|2006]]) {{ISBN|0-307-27836-0}}

==Awards==
* 1959, 1960 Ingram-Merrill awards
* 1965 Traveling Fellowship from the [[American Academy of Arts and Letters]]
* 1966 [[William Faulkner Foundation Award]] for notable first novel for ''The Orchard Keeper''<ref name=nytint>
{{cite news|last=Woodward|first=Richard|title=Cormac McCarthy's Venomous Fiction|newspaper=[[The New York Times]]|date=May 17, 1998|url=https://www.nytimes.com/books/98/05/17/specials/mccarthy-venom.html|accessdate=July 14, 2017}}</ref>
* 1969 [[Guggenheim Fellowship]] for creative writing
* 1981 [[MacArthur Fellows Program|MacArthur Fellowship]]<ref name=persp/>
* 1992 [[National Book Award for Fiction]]<ref name=nba1992>
[https://www.nationalbook.org/awards-prizes/national-book-awards-1992 "National Book Awards – 1992"]. [[National Book Foundation]]; retrieved March 28, 2012.<br/>(With acceptance speech by McCarthy and essay by Harold Augenbraum from the Awards 60-year anniversary blog.)</ref> and the [[National Book Critics Circle Award]] for ''[[All the Pretty Horses (novel)|All the Pretty Horses]]''{{citation needed|date=July 2017}}
* 1996 [[International Dublin Literary Award]] longlist for ''[[The Crossing (McCarthy novel)|The Crossing]]''
* 2000 [[International Dublin Literary Award]] longlist for ''[[Cities of the Plain (novel)|Cities of the Plain]]''
* 2006 [[James Tait Black Memorial Prize]] for Fiction and [[Believer Book Award]] for ''[[The Road]]''
* 2007 [[Pulitzer Prize for Fiction]] for ''[[The Road]]''<ref name=pulitzer>
[https://www.pulitzer.org/prize-winners-by-category/219 "Fiction"]. ''Past winners & finalists by category'', Pulitzer.org; retrieved March 28, 2012.</ref>
* 2007 [[International Dublin Literary Award]] shortlist for ''[[No Country for Old Men]]''
* 2008 [[Maltese Falcon Award#Falcon Awards|Maltese Falcon Award]], Japan, for ''[[No Country for Old Men]]''
* 2008 [[Premio Ignotus]] for ''The Road''
* 2008 [[International Dublin Literary Award]] longlist for ''[[The Road]]''
* 2008 [[PEN/Saul Bellow Award for Achievement in American Fiction]], for a career whose writing "possesses qualities of excellence, ambition, and scale of achievement over a sustained career which place him or her in the highest rank of American literature."{{citation needed|date=July 2017}}
* 2012 [[Best of the James Tait Black]], shortlist, ''The Road''<ref name=leadbetter>{{cite web|url=http://www.heraldscotland.com/news/home-news/book-prize-names-six-of-the-best-in-search-for-winner.19197747|title=Book prize names six of the best in search for winner|work=Herald Scotland|author=Russell Leadbetter|accessdate=July 14, 2017}}</ref><ref name=bbcnews2012>{{cite news|url=https://www.bbc.co.uk/news/uk-scotland-20020630|title=Authors in running for 'best of best' James Tait Black award|work=BBC News|accessdate=July 14, 2017}}</ref>

==Dramatic adaptations==
;Released
:'''''Television:'''''
* ''[[The Gardener's Son]]'' (airdate January 1977) was broadcast as part of a series for [[Public Broadcasting Service|PBS]]. McCarthy wrote the screenplay upon request for director Richard Pearce.<ref>{{cite news|last=Woodward |first=Richard B. |url=https://query.nytimes.com/gst/fullpage.html?res=9E0CE6DA163EF93AA25757C0A964958260 |title=Cormac McCarthy's Venomous Fiction – Biography|newspaper=[[The New York Times]]|date=April 19, 1992|accessdate=January 11, 2010}}</ref>
* An adaptation of McCarthy's play ''[[The Sunset Limited]]'' (2006) aired on [[HBO]] in February 2011,  starring Tommy Lee Jones (who also directed) and [[Samuel L. Jackson]].<ref>{{cite news| url=http://articles.latimes.com/2011/jan/09/entertainment/la-ca-winter-sunset-limited-20110109 | work=Los Angeles Times | first=Melissa | last=Maerz | date=January 9, 2011| title=Midseason Television preview: 'The Sunset Limited'}}</ref>
:'''''Feature films:'''''
* McCarthy's 1992 novel ''[[All the Pretty Horses (novel)|All the Pretty Horses]]'' was made into a 2000 [[All the Pretty Horses (film)|film]] directed by [[Billy Bob Thornton]], starring [[Matt Damon]] and [[Penélope Cruz]].
* McCarthy's 2005 novel ''[[No Country for Old Men]]'' was adapted into a 2007 [[Academy Awards|Academy Award]]-winning [[No Country for Old Men (film)|film]] directed by the [[Coen brothers]] and starring [[Tommy Lee Jones]], [[Josh Brolin]], and [[Javier Bardem]].
* A [[The Road (2009 film)|2009 film]] based on the 2006 novel ''[[The Road]]'' was directed by [[John Hillcoat]] and adapted by [[Joe Penhall]].<ref>{{cite news| author =| coauthors =| title = John Hillcoat Hits The Road| url = http://www.empireonline.com/news/story.asp?NID=20573| format =| work =| publisher = Empire Online UK| id =| pages =| page =| date =| accessdate =| language =| quote = }}</ref> The leading roles include [[Viggo Mortensen]] as the father,<ref>{{cite news|author= |coauthors= |title=Is Guy Pearce Going on 'The Road'? |url=http://www.cinematical.com/2007/11/05/is-guy-pearce-going-on-the-road/ |date=November 5, 2007 |publisher=Cinematical.com |deadurl=yes |archiveurl=https://web.archive.org/web/20080311120802/http://www.cinematical.com/2007/11/05/is-guy-pearce-going-on-the-road/ |archivedate=March 11, 2008 }}</ref> [[Kodi Smit-McPhee]] as the boy, [[Charlize Theron]] as the wife,<ref>{{cite news| author=Staff| date=January 15, 2008| title=Theron Hits The Road| publisher=Sci Fi Wire| url=http://www.scifi.com/scifiwire/index.php?category=0&id=47293| accessdate=May 24, 2006| archiveurl = https://web.archive.org/web/20080116151318/http://www.scifi.com/scifiwire/index.php?category=0&id=47293| archivedate = January 16, 2008}}</ref> and [[Robert Duvall]] as the old man. The film opened on November 25, 2009 to mostly positive reviews.<ref>{{cite news | first=Steven | last=Zeitchik | url=https://www.reuters.com/article/filmNews/idUSTRE49J0A820081020 | title= Road rerouted into 2009 release schedule | work=[[The Hollywood Reporter]] | publisher=Reuters | date=October 18, 2008}}</ref>
* A [[Child of God (film)|2013 film adaptation]] of McCarthy's 1973 novel ''[[Child of God]]'', directed by [[James Franco]], premiered at the [[70th Venice International Film Festival]].<ref>{{cite news| url=http://www.hollywoodreporter.com/review/child-god-venice-review-618828 | work=The Hollywood Reporter | first=David | last=Rooney | title=Child of God: Venice Review | date=August 31, 2013}}</ref>
:'''''Short films:'''''
* In 2009, ''[[Outer Dark]]'' was made into a 15-minute short film (directed by Stephen Imwalle)<ref>{{cite web|title=Outer Dark (2009)|url=https://www.imdb.com/title/tt1202237/|website=imdb.com|accessdate=January 30, 2018}}</ref> released on the U.S. festival circuit.

;Rumored
* A film adaptation of ''[[Blood Meridian]]'' has been rumored for years; James Franco, [[Todd Field]], [[Scott Rudin]], and [[Ridley Scott]] have been connected at one point or another to the project, which has fallen through at least twice.<ref name=Exclusive>{{cite web|last=Staskiewicz|first=Keith|title=EW exclusive: James Franco talks directing William Faulkner, and how Jacob from 'Lost' helped him land 'Blood Meridian'|url=http://insidemovies.ew.com/2011/01/03/james-franco-william-faulkner-acormac-mccarthy/|work=ew.com|accessdate=September 28, 2011}}</ref><ref name=Maybe>{{cite web|last=Anderton|first=Ethan|title=James Franco Maybe Adapting 'As I Lay Dying' & 'Blood Meridian'|url=http://www.firstshowing.net/2011/james-franco-maybe-adapting-as-i-lay-dying-blood-meridian/|work=firstshowing.net|accessdate=September 28, 2011}}</ref>

==References==
{{Reflist}}

==Further reading==
*{{cite book|title=Understanding Cormac McCarthy|first=Steven|last=Frye|publisher=University of South Carolina Press|year=2009|location=Columbia, SC|isbn=978-1570038396}}
*{{cite book|title=The Cambridge Companion to Cormac McCarthy|editor-first=Steven|editor-last=Frye|publisher=Cambridge University Press|location=Cambridge|year=2013|isbn=978-1107644809}}
*{{cite journal|title=Cormac McCarthy: A Bibliography|first=Dianne C.|last=Luce|journal=The Cormac McCarthy Journal|volume=1|issue=1|pages=72–84|year=2001|jstor=4290933}} ([http://www.cormacmccarthy.com/wp-content/uploads/McCarthyEnglishBib_20111026.pdf updated version] published 26 October 2011)
*{{cite episode|url=http://www.sciencefriday.com/segment/04/08/2011/connecting-science-and-art.html|title=Connecting Science and Art|series=Science Friday|date=April 8, 2011|accessdate=May 25, 2015}}

==External links==
{{Wikiquote}}
* [http://www.cormacmccarthy.com/ The Cormac McCarthy Society]
* [http://www.thewittliffcollections.txstate.edu/research/a-z/mccarthy.html Southwestern Writers Collection at the Witliff Collection, Texas State University] – Cormac McCarthy Papers
* {{worldcat id|id=lccn-n82-28392}}
* {{IMDb name|0565092}}
* [http://westernamericanliterature.com/cormac-mccarthy/ Western American Literature Journal: Cormac McCarthy]

{{NBA for Fiction 1975–1999}}
{{PulitzerPrize Fiction 2001–2025}}
{{Cormac McCarthy}}
{{Authority control}}

{{DEFAULTSORT:McCarthy, Cormac}}
[[Category:Cormac McCarthy| ]]
[[Category:1933 births]]
[[Category:Living people]]
[[Category:20th-century American novelists]]
[[Category:21st-century American novelists]]
[[Category:American male dramatists and playwrights]]
[[Category:American male novelists]]
[[Category:American male screenwriters]]
[[Category:American people of Irish descent]]
[[Category:Believer Book Award winners]]
[[Category:Guggenheim Fellows]]
[[Category:James Tait Black Memorial Prize recipients]]
[[Category:MacArthur Fellows]]
[[Category:Maltese Falcon Award winners]]
[[Category:Minimalist writers]]
[[Category:National Book Award winners]]
[[Category:People from El Paso, Texas]]
[[Category:People from Knoxville, Tennessee]]
[[Category:Pulitzer Prize for Fiction winners]]
[[Category:The New Yorker people]]
[[Category:United States Air Force airmen]]
[[Category:Western (genre) writers]]
[[Category:Writers from Santa Fe, New Mexico]]
[[Category:Screenwriters from New Mexico]]
[[Category:Screenwriters from Tennessee]]
[[Category:Screenwriters from Texas]]
[[Category:Santa Fe Institute people]]
[[Category:Screenwriters from Rhode Island]]
[[Category:Novelists from Texas]]
[[Category:Novelists from Tennessee]]
[[Category:People from Tesuque, New Mexico]]`;
